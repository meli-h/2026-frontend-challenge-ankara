import type { AppRecord, RecordKind } from '../types';
import { lookupPerson, type PersonEntry } from '../utils/personIndex';

interface Props {
  record: AppRecord;
  personIndex: Map<string, PersonEntry>;
  onSelectPerson: (person: PersonEntry) => void;
}

const KIND_LABELS: Record<RecordKind, string> = {
  checkin: 'Checkin',
  message: 'Message',
  sighting: 'Sighting',
  personalNote: 'Personal Note',
  anonymousTip: 'Anonymous Tip',
};

const KIND_BADGES: Record<RecordKind, string> = {
  checkin: 'bg-emerald-100 text-emerald-800',
  message: 'bg-blue-100 text-blue-800',
  sighting: 'bg-amber-100 text-amber-800',
  personalNote: 'bg-purple-100 text-purple-800',
  anonymousTip: 'bg-red-100 text-red-800',
};

interface PersonLinkProps {
  name: string;
  fallback?: string;
  personIndex: Map<string, PersonEntry>;
  onSelectPerson: (person: PersonEntry) => void;
}

function PersonLink({
  name,
  fallback = '—',
  personIndex,
  onSelectPerson,
}: PersonLinkProps) {
  const trimmed = name.trim();
  if (!trimmed) return <span className="text-gray-400">{fallback}</span>;
  const person = lookupPerson(personIndex, trimmed);
  if (!person) return <strong>{trimmed}</strong>;
  return (
    <button
      type="button"
      onClick={() => onSelectPerson(person)}
      className="font-semibold text-indigo-700 underline decoration-dotted underline-offset-2 hover:text-indigo-900"
    >
      {trimmed}
    </button>
  );
}

function splitCommaNames(raw: string): string[] {
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

function RecordCard({ record, personIndex, onSelectPerson }: Props) {
  const time = record.timestamp || record.createdAt;
  const location = record.location || 'Konum belirtilmemiş';

  return (
    <article className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
      <header className="mb-2 flex items-center justify-between gap-2">
        <span
          className={`rounded px-2 py-0.5 text-xs font-medium ${KIND_BADGES[record.kind]}`}
        >
          {KIND_LABELS[record.kind]}
        </span>
        <time className="text-xs text-gray-500">{time}</time>
      </header>
      <div className="text-sm text-gray-800">
        {renderBody(record, personIndex, onSelectPerson)}
      </div>
      <footer className="mt-2 text-xs text-gray-500">Konum · {location}</footer>
    </article>
  );
}

function renderBody(
  record: AppRecord,
  personIndex: Map<string, PersonEntry>,
  onSelectPerson: (person: PersonEntry) => void,
) {
  const linkProps = { personIndex, onSelectPerson };
  switch (record.kind) {
    case 'checkin':
      return (
        <>
          <p>
            <PersonLink
              name={record.personName}
              fallback="Bilinmeyen"
              {...linkProps}
            />{' '}
            check-in yaptı.
          </p>
          {record.note && <p className="mt-1 text-gray-600">{record.note}</p>}
        </>
      );
    case 'message':
      return (
        <>
          <p>
            <PersonLink name={record.senderName} {...linkProps} /> →{' '}
            <PersonLink name={record.recipientName} {...linkProps} />
            {record.urgency && (
              <span className="ml-2 rounded bg-gray-100 px-1.5 py-0.5 text-xs">
                {record.urgency}
              </span>
            )}
          </p>
          {record.text ? (
            <p className="mt-1 italic text-gray-700">"{record.text}"</p>
          ) : (
            <p className="mt-1 text-gray-400">Mesaj içeriği yok</p>
          )}
        </>
      );
    case 'sighting':
      return (
        <>
          <p>
            <PersonLink name={record.personName} {...linkProps} />,{' '}
            <PersonLink
              name={record.seenWith}
              fallback="yalnız"
              {...linkProps}
            />{' '}
            ile görüldü.
          </p>
          {record.note && <p className="mt-1 text-gray-600">{record.note}</p>}
        </>
      );
    case 'personalNote': {
      const mentioned = splitCommaNames(record.mentionedPeople);
      return (
        <>
          <p>
            <em>
              <PersonLink
                name={record.authorName}
                fallback="Anonim"
                {...linkProps}
              />{' '}
              notu
            </em>
            {mentioned.length > 0 && (
              <span className="text-gray-500">
                {' '}
                · Bahsedilen:{' '}
                {mentioned.map((n, i) => (
                  <span key={`${n}-${i}`}>
                    {i > 0 && ', '}
                    <PersonLink name={n} {...linkProps} />
                  </span>
                ))}
              </span>
            )}
          </p>
          <p className="mt-1 text-gray-700">
            {record.note || (
              <span className="text-gray-400">Not bulunmamakta</span>
            )}
          </p>
        </>
      );
    }
    case 'anonymousTip':
      return (
        <>
          <p>
            <strong>
              Şüpheli:{' '}
              <PersonLink
                name={record.suspectName}
                fallback="bilinmiyor"
                {...linkProps}
              />
            </strong>
            {record.confidence && (
              <span className="ml-2 rounded bg-gray-100 px-1.5 py-0.5 text-xs">
                güven: {record.confidence}
              </span>
            )}
          </p>
          {record.tip ? (
            <p className="mt-1 text-gray-700">"{record.tip}"</p>
          ) : (
            <p className="mt-1 text-gray-400">İhbar içeriği yok</p>
          )}
        </>
      );
  }
}

export default RecordCard;
