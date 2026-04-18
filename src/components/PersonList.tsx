import type { PersonEntry } from '../utils/personIndex';

interface Props {
  persons: PersonEntry[];
  selected: PersonEntry | null;
  onSelect: (person: PersonEntry) => void;
}

function PersonList({ persons, selected, onSelect }: Props) {
  if (persons.length === 0) {
    return (
      <div className="p-3 text-sm text-gray-500">
        No persons match your search
      </div>
    );
  }

  return (
    <ul className="space-y-1">
      {persons.map((p) => {
        const isPodo = p.normalizedName === 'podo';
        const isSuspect = p.roles.has('suspect');
        const isSelected = selected?.normalizedName === p.normalizedName;
        return (
          <li key={p.normalizedName}>
            <button
              type="button"
              onClick={() => onSelect(p)}
              className={`w-full rounded-md border p-3 text-left transition ${
                isSelected
                  ? 'border-indigo-400 bg-indigo-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="font-semibold text-gray-900">
                {isPodo && '⭐ '}
                {p.name}
                {isSuspect && (
                  <span className="ml-2 rounded bg-red-100 px-1.5 py-0.5 text-xs font-medium text-red-800">
                    suspect
                  </span>
                )}
              </div>
              <div className="mt-0.5 text-sm text-gray-600">
                {p.appearances.length} records · {p.roles.size} roles
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export default PersonList;
