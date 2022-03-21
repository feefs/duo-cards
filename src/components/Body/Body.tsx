import { Route, Routes } from 'react-router-dom';

import Deck from './Deck';
import Decks from './Decks';
import Editor from './Editor';

function Body(): JSX.Element {
  return (
    <Routes>
      <Route path="" element={<Decks />} />
      <Route path="deck">
        <Route path="" element={<Deck />} />
        <Route path=":deckId" element={<Deck />} />
      </Route>
      <Route path="new" element={<Editor />} />
    </Routes>
  );
}

export default Body;
