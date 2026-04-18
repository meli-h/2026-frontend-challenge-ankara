import type { PersonEntry, SuspiciousEntry } from '../utils/personIndex';

interface Props {
  entries: SuspiciousEntry[];
  onSelectPerson: (person: PersonEntry) => void;
}

function MostSuspiciousCard({ entries, onSelectPerson }: Props) {
  if (entries.length === 0) {
    return (
      <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">
        Henüz şüpheli bir kayıt yok.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-rose-300 bg-rose-50 p-4">
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-rose-700">
        En şüpheli kişiler
      </div>
      <ol className="space-y-1 text-sm">
        {entries.map(({ person, tipCount, mentionCount }, i) => (
          <li key={person.normalizedName} className="flex items-baseline gap-2">
            <span className="w-4 text-right text-xs font-semibold text-rose-700">
              {i + 1}.
            </span>
            <button
              type="button"
              onClick={() => onSelectPerson(person)}
              className="font-semibold text-indigo-700 underline decoration-dotted underline-offset-2 hover:text-indigo-900"
            >
              {person.name}
            </button>
            <span className="text-xs text-gray-600">
              {tipCount > 0 && `${tipCount} ipucu`}
              {tipCount > 0 && mentionCount > 0 && ' · '}
              {mentionCount > 0 && `${mentionCount} mention`}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default MostSuspiciousCard;
