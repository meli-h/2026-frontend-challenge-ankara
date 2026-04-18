import { useState } from 'react';
import {
  recordMatchesQuery,
  type PersonEntry,
} from '../utils/personIndex';
import type { RecordKind } from '../types';
import RecordCard from './RecordCard';

interface Props {
  person: PersonEntry;
  personIndex: Map<string, PersonEntry>;
  onSelectPerson: (person: PersonEntry) => void;
  query: string;
}

type KindFilter = RecordKind | 'all';

const KIND_FILTERS: { value: KindFilter; label: string }[] = [
  { value: 'all', label: 'Hepsi' },
  { value: 'sighting', label: 'Sighting' },
  { value: 'message', label: 'Message' },
  { value: 'anonymousTip', label: 'Tip' },
  { value: 'personalNote', label: 'Note' },
  { value: 'checkin', label: 'Checkin' },
];

function TimelinePanel({
  person,
  personIndex,
  onSelectPerson,
  query,
}: Props) {
  const [kindFilter, setKindFilter] = useState<KindFilter>('all');

  const sorted = [...person.appearances].sort((a, b) =>
    a.record.createdAt.localeCompare(b.record.createdAt),
  );

  const visible = sorted.filter((a) => {
    if (kindFilter !== 'all' && a.record.kind !== kindFilter) return false;
    if (query.trim() && !recordMatchesQuery(a.record, query)) return false;
    return true;
  });

  const activeLabel =
    KIND_FILTERS.find((f) => f.value === kindFilter)?.label ?? 'Hepsi';
  const countText =
    kindFilter === 'all' && !query.trim()
      ? `${person.appearances.length} toplam kayıt`
      : `${visible.length} ${query.trim() ? 'eşleşen' : activeLabel.toLowerCase()} · ${person.appearances.length} toplam`;

  return (
    <div>
      <div className="mb-4 border-b border-gray-200 pb-3">
        <h2 className="text-xl font-semibold text-gray-900">{person.name}</h2>
        <div className="mt-1 flex flex-wrap gap-1">
          {Array.from(person.roles).map((role) => (
            <span
              key={role}
              className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-700"
            >
              {role}
            </span>
          ))}
        </div>
        <div className="mt-2 text-sm text-gray-600">{countText}</div>
      </div>

      <div className="mb-3 flex flex-wrap gap-1">
        {KIND_FILTERS.map(({ value, label }) => {
          const active = kindFilter === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => setKindFilter(value)}
              className={`rounded px-2 py-0.5 text-xs font-medium transition ${
                active
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <div className="text-sm text-gray-500">
          {query.trim() || kindFilter !== 'all'
            ? 'Bu filtre ile eşleşen kayıt yok.'
            : 'Bu kişi için kayıt yok.'}
        </div>
      ) : (
        <ul className="space-y-3">
          {visible.map((appearance, i) => (
            <li key={`${appearance.record.kind}-${appearance.record.id}-${i}`}>
              <RecordCard
                record={appearance.record}
                personIndex={personIndex}
                onSelectPerson={onSelectPerson}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TimelinePanel;
