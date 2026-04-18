import type { PersonEntry } from '../utils/personIndex';
import { lookupPerson } from '../utils/personIndex';
import type { Sighting } from '../types';

interface Props {
  sighting: Sighting | undefined;
  personIndex: Map<string, PersonEntry>;
  onSelectPerson: (person: PersonEntry) => void;
}

function PodoLastSeenCard({ sighting, personIndex, onSelectPerson }: Props) {
  if (!sighting) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        Podo için henüz bir sighting kaydı yok.
      </div>
    );
  }

  const when = sighting.timestamp || sighting.createdAt;
  const whereText = sighting.location || 'bilinmeyen bir konum';
  const companionName = sighting.seenWith.trim();
  const companionPerson = companionName
    ? lookupPerson(personIndex, companionName)
    : undefined;

  return (
    <div className="rounded-lg border border-amber-300 bg-amber-50 p-4">
      <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
        Podo son görülme
      </div>
      <div className="text-sm text-gray-900">
        Podo en son{' '}
        {companionPerson ? (
          <button
            type="button"
            onClick={() => onSelectPerson(companionPerson)}
            className="font-semibold text-indigo-700 underline decoration-dotted underline-offset-2 hover:text-indigo-900"
          >
            {companionName}
          </button>
        ) : (
          <strong>{companionName || 'bilinmeyen biri'}</strong>
        )}{' '}
        ile <strong>{when}</strong> tarihinde <strong>{whereText}</strong>'da
        görüldü.
      </div>
    </div>
  );
}

export default PodoLastSeenCard;
