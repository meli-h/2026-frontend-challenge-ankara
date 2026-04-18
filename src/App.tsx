import { useEffect } from 'react';
import { fetchAllRecords } from './api/jotform';
import './App.css';

function App() {
  useEffect(() => {
    fetchAllRecords().then((records) => {
      console.log('Total:', records.length);
      console.log(
        'Sightings sample:',
        records.find((r) => r.kind === 'sighting'),
      );
      console.log(
        'Messages sample:',
        records.find((r) => r.kind === 'message'),
      );
    });
  }, []);

  return <></>;
}

export default App;
