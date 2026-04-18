import { useEffect, useMemo, useState } from 'react';
import { fetchAllRecords } from './api/jotform';
import {
  buildPersonIndex,
  getPersonList,
  personMatchesQuery,
  type PersonEntry,
} from './utils/personIndex';
import type { AppRecord } from './types';
import SearchBar from './components/SearchBar';
import PersonList from './components/PersonList';
import TimelinePanel from './components/TimelinePanel';

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
    <div className="mx-auto max-w-6xl p-4">
      <header className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">
           Missing Podo: The Ankara Case
        </h1>
        <div className="mt-3">
          <SearchBar value={query} onChange={setQuery} />
        </div>
      </header>

      <main className="grid grid-cols-[280px_1fr] gap-6">
        <aside className="max-h-[75vh] overflow-y-auto">
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
