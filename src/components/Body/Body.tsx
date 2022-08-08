import { Route, Routes } from 'react-router-dom';

import Collection from './Collection';
import Collections from './Collections';
import Deck from './Deck';
import { NewEditor, DeckEditor, CuratedEditor } from './Editors';
import Practice from './Practice';
import Uncollected from './Uncollected';

function Body(): JSX.Element {
  return (
    <Routes>
      <Route path="" element={<Collections />} />
      <Route path="uncollected" element={<Uncollected />} />
      <Route path="collection" element={<Collection />}>
        <Route path="" element={<Collection />} />
        <Route path=":collectionId" element={<Collection />} />
      </Route>
      <Route path="deck">
        <Route path="" element={<Deck />} />
        <Route path=":deckId" element={<Deck />} />
      </Route>
      <Route path="new" element={<NewEditor />} />
      <Route path="edit">
        <Route path="" element={<DeckEditor />} />
        <Route path=":deckId" element={<DeckEditor />} />
      </Route>
      <Route path="curated" element={<CuratedEditor />} />
      <Route path="practice">
        <Route path="" element={<Practice />} />
        <Route path=":deckId" element={<Practice />} />
      </Route>
    </Routes>
  );
}

export default Body;
