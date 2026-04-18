import type { Sighting } from '../types';
import { lookupPerson, type PersonEntry } from '../utils/personIndex';

interface Props {
  sightings: Sighting[];
  personIndex: Map<string, PersonEntry>;
  onSelectPerson: (person: PersonEntry) => void;
}

function companionName(s: Sighting): string {
  const personKey = s.personName.trim().toLocaleLowerCase('tr');
  if (personKey === 'podo') return s.seenWith.trim();
  return s.personName.trim();
}

function PodoRouteCard({ sightings, personIndex, onSelectPerson }: Props) {
  if (sightings.length === 0) {
    return (
      <div className="rounded-lg border border-sky-200 bg-sky-50 p-4 text-sm text-sky-900">
        Podo için henüz bir rota oluşmadı.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-sky-300 bg-sky-50 p-4">
      <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-sky-700">
        Podo'nun rotası
      </div>
      <ol className="relative space-y-3 border-l-2 border-sky-300 pl-4">
        {sightings.map((s, i) => {
          const companion = companionName(s);
          const companionPerson = companion
            ? lookupPerson(personIndex, companion)
            : undefined;
          const when = s.timestamp || s.createdAt;
          const where = s.location || 'bilinmeyen konum';
          return (
            <li key={s.id} className="relative">
              <span className="absolute -left-[22px] flex h-4 w-4 items-center justify-center rounded-full bg-sky-600 text-[10px] font-bold text-white">
                {i + 1}
              </span>
              <div className="text-sm text-gray-900">
                <span className="font-semibold">{where}</span>
                <span className="text-gray-500"> · {when}</span>
              </div>
              <div className="text-xs text-gray-700">
                {companionPerson ? (
                  <button
                    type="button"
                    onClick={() => onSelectPerson(companionPerson)}
                    className="font-semibold text-indigo-700 underline decoration-dotted underline-offset-2 hover:text-indigo-900"
                  >
                    {companion}
                  </button>
                ) : (
                  <strong>{companion || 'yalnız'}</strong>
                )}{' '}
                ile
                {s.note && (
                  <span className="text-gray-500"> — {s.note}</span>
                )}
              </div>
            </li>
          );
        })}
        <li className="relative">
          <span className="absolute -left-[22px] flex h-4 w-4 items-center justify-center rounded-full bg-gray-400 text-[10px] font-bold text-white">
            ?
          </span>
          <div className="text-xs italic text-gray-600">
            Podo buradan sonra kayboldu.
          </div>
        </li>
      </ol>
    </div>
  );
}

export default PodoRouteCard;
