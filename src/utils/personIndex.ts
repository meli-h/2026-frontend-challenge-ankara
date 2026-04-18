import type { AppRecord, Sighting } from '../types';

export type PersonRole =
  | 'checkedIn'
  | 'sender'
  | 'recipient'
  | 'sighted'
  | 'seenWith'
  | 'author'
  | 'mentioned'
  | 'suspect';

export interface PersonAppearance {
  record: AppRecord;
  role: PersonRole;
}

export interface PersonEntry {
  name: string;
  normalizedName: string;
  roles: Set<PersonRole>;
  appearances: PersonAppearance[];
}

const SPLIT_REGEX = /\s*(?:,|;|\sve\s|\sand\s)\s*/i;

function splitNames(raw: string): string[] {
  if (!raw) return [];
  return raw
    .split(SPLIT_REGEX)
    .map((name) => name.trim())
    .filter((name) => name.length > 0);
}

function normalizeKey(name: string): string {
  return name.trim().toLocaleLowerCase('tr');
}

export function buildPersonIndex(
  records: AppRecord[],
): Map<string, PersonEntry> {
  const index = new Map<string, PersonEntry>();

  const addAppearance = (
    rawName: string,
    record: AppRecord,
    role: PersonRole,
  ): void => {
    const name = rawName.trim();
    if (!name) return;
    const key = normalizeKey(name);
    let entry = index.get(key);
    if (!entry) {
      entry = {
        name,
        normalizedName: key,
        roles: new Set<PersonRole>(),
        appearances: [],
      };
      index.set(key, entry);
    }
    entry.roles.add(role);
    entry.appearances.push({ record, role });
  };

  for (const record of records) {
    switch (record.kind) {
      case 'checkin':
        addAppearance(record.personName, record, 'checkedIn');
        break;
      case 'message':
        addAppearance(record.senderName, record, 'sender');
        addAppearance(record.recipientName, record, 'recipient');
        break;
      case 'sighting':
        addAppearance(record.personName, record, 'sighted');
        for (const name of splitNames(record.seenWith)) {
          addAppearance(name, record, 'seenWith');
        }
        break;
      case 'personalNote':
        addAppearance(record.authorName, record, 'author');
        for (const name of splitNames(record.mentionedPeople)) {
          addAppearance(name, record, 'mentioned');
        }
        break;
      case 'anonymousTip':
        addAppearance(record.suspectName, record, 'suspect');
        break;
    }
  }

  return index;
}

export function getPersonList(
  index: Map<string, PersonEntry>,
): PersonEntry[] {
  return Array.from(index.values()).sort(
    (a, b) => b.appearances.length - a.appearances.length,
  );
}

export function lookupPerson(
  index: Map<string, PersonEntry>,
  name: string,
): PersonEntry | undefined {
  if (!name) return undefined;
  return index.get(normalizeKey(name));
}

export function personMatchesQuery(
  person: PersonEntry,
  rawQuery: string,
): boolean {
  const q = rawQuery.trim().toLocaleLowerCase('tr');
  if (!q) return true;
  if (person.normalizedName.includes(q)) return true;
  return person.appearances.some(({ record }) =>
    recordMatchesNormalized(record, q),
  );
}

export function recordMatchesQuery(
  record: AppRecord,
  rawQuery: string,
): boolean {
  const q = rawQuery.trim().toLocaleLowerCase('tr');
  if (!q) return true;
  return recordMatchesNormalized(record, q);
}

function recordMatchesNormalized(record: AppRecord, q: string): boolean {
  const fields: string[] = [record.location];
  switch (record.kind) {
    case 'checkin':
      fields.push(record.note);
      break;
    case 'message':
      fields.push(record.text);
      break;
    case 'sighting':
      fields.push(record.note);
      break;
    case 'personalNote':
      fields.push(record.note, record.mentionedPeople);
      break;
    case 'anonymousTip':
      fields.push(record.tip);
      break;
  }
  return fields.some((f) => f.toLocaleLowerCase('tr').includes(q));
}

export function getLastSeenWithPodo(
  records: AppRecord[],
): Sighting | undefined {
  const podoKey = normalizeKey('Podo');
  const sightings = records.filter(
    (r): r is Sighting =>
      r.kind === 'sighting' &&
      (normalizeKey(r.personName) === podoKey ||
        splitNames(r.seenWith).some((n) => normalizeKey(n) === podoKey)),
  );
  sightings.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return sightings[0];
}
