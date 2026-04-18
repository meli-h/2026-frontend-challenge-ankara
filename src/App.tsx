import { useEffect } from 'react';
import { fetchAllRecords } from './api/jotform';
import {
  buildPersonIndex,
  getLastSeenWithPodo,
  getPersonList,
} from './utils/personIndex';
import './App.css';

function App() {
  useEffect(() => {
    fetchAllRecords().then((records) => {
      const index = buildPersonIndex(records);
      console.log('Total persons:', index.size);
      console.log('Top 5:', getPersonList(index).slice(0, 5));
      console.log('Podo profile:', index.get('podo'));
      console.log('Last seen with Podo:', getLastSeenWithPodo(records));
    });
  }, []);

  return <></>;
}

export default App;
