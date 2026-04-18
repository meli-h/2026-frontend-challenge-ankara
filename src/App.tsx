import { useEffect, useMemo, useState } from 'react';
import { fetchAllRecords } from './api/jotform';
import {
  buildPersonIndex,
  getLastSeenWithPodo,
  getMostSuspicious,
  getPersonList,
  getPodoRoute,
  personMatchesQuery,
  type PersonEntry,
} from './utils/personIndex';
import type { AppRecord } from './types';
import SearchBar from './components/SearchBar';
import PersonList from './components/PersonList';
import TimelinePanel from './components/TimelinePanel';
import PodoLastSeenCard from './components/PodoLastSeenCard';
import MostSuspiciousCard from './components/MostSuspiciousCard';
import PodoRouteCard from './components/PodoRouteCard';

function App() {
  const [records, setRecords] = useState<AppRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<PersonEntry | null>(null);
  const [query, setQuery] = useState<string>('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchAllRecords()
      .then((data) => {
        if (!cancelled) setRecords(data);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Unknown error');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const personIndex = useMemo(() => buildPersonIndex(records), [records]);
  const personList = useMemo(() => getPersonList(personIndex), [personIndex]);
  const lastPodoSighting = useMemo(
    () => getLastSeenWithPodo(records),
    [records],
  );
  const mostSuspicious = useMemo(
    () => getMostSuspicious(personIndex),
    [personIndex],
  );
  const podoRoute = useMemo(() => getPodoRoute(records), [records]);

  useEffect(() => {
    if (!selected && personList.length > 0) {
      const podo = personList.find((p) => p.normalizedName === 'podo');
      setSelected(podo ?? personList[0]);
    }
  }, [personList, selected]);

  const filteredPersons = useMemo(() => {
    if (!query.trim()) return personList;
    return personList.filter((p) => personMatchesQuery(p, query));
  }, [personList, query]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-500">
        Loading investigation data…
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center text-red-600">
        Error: {error}
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-500">
        No records found
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-3 md:p-4">
      <header className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">
           Missing Podo: The Ankara Case
        </h1>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <PodoLastSeenCard
            sighting={lastPodoSighting}
            personIndex={personIndex}
            onSelectPerson={setSelected}
          />
          <MostSuspiciousCard
            entries={mostSuspicious}
            onSelectPerson={setSelected}
          />
        </div>
        <div className="mt-3">
          <PodoRouteCard
            sightings={podoRoute}
            personIndex={personIndex}
            onSelectPerson={setSelected}
          />
        </div>
        <div className="mt-3">
          <SearchBar value={query} onChange={setQuery} />
        </div>
      </header>

      <main className="grid grid-cols-1 gap-4 md:grid-cols-[280px_1fr] md:gap-6">
        <aside className="max-h-60 overflow-y-auto md:max-h-[75vh]">
          <PersonList
            persons={filteredPersons}
            selected={selected}
            onSelect={setSelected}
          />
        </aside>

        <section>
          {selected ? (
            <TimelinePanel
              person={selected}
              personIndex={personIndex}
              onSelectPerson={setSelected}
              query={query}
            />
          ) : (
            <div className="text-gray-500">
              Select a person to view their timeline
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
