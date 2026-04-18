import type { PersonEntry } from '../utils/personIndex';
import RecordCard from './RecordCard';

interface Props {
  person: PersonEntry;
  personIndex: Map<string, PersonEntry>;
  onSelectPerson: (person: PersonEntry) => void;
}

function TimelinePanel({ person, personIndex, onSelectPerson }: Props) {
  const sorted = [...person.appearances].sort((a, b) =>
    a.record.createdAt.localeCompare(b.record.createdAt),
  );

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
        <div className="mt-2 text-sm text-gray-600">
          {person.appearances.length} toplam kayıt
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="text-sm text-gray-500">Bu kişi için kayıt yok.</div>
      ) : (
        <ul className="space-y-3">
          {sorted.map((appearance, i) => (
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
