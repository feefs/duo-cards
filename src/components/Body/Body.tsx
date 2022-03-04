import { Route, Routes } from 'react-router-dom';

import Deck from './Deck';
import Decks from './Decks';

function Body(): JSX.Element {
  return (
    <Routes>
      <Route path="duo-cards" element={<Decks />} />
      <Route path="duo-cards/deck">
        <Route path="" element={<Deck />} />
        <Route path=":deckId" element={<Deck />} />
      </Route>
    </Routes>
  );
}

export default Body;
