import { collection, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';

import { auth, firestore } from '../../../ts/firebase';
import { DeckSchema } from '../../../ts/interfaces';
import './Decks.scss';

function Decks(): JSX.Element {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  const [decks, setDecks] = useState<DeckSchema[]>([]);
  const [empty, setEmpty] = useState<boolean>(false);

  useEffect(() => {
    async function fetchDecks() {
      if (!user) {
        setDecks([]);
        setEmpty(false);
        return;
      }
      const decks: DeckSchema[] = [];
      (await getDocs(query(collection(firestore, 'decks'), where('creator_uid', '==', user.uid)))).forEach((doc) =>
        decks.push({
          ...doc.data(),
          id: doc.id,
        } as DeckSchema)
      );
      if (decks.length === 0) {
        setEmpty(true);
      }
      setDecks(decks);
    }

    fetchDecks();
  }, [user]);

  return (
    <div className="Decks">
      <div className="decks">
        {loading || (user && !empty) ? (
          decks.map((deck) => (
            <div className="deck-preview" key={deck.id} onClick={() => navigate(`./deck/${deck.id}`)}>
              <div className="name">{deck.name}</div>
            </div>
          ))
        ) : (
          <div className="deck-text">{empty ? 'No decks, make one!' : 'User not signed in, decks not available!'}</div>
        )}
      </div>
      <div className="new">
        <button className={user ? '' : 'disabled'}>New</button>
      </div>
      <div className="curated">Curated</div>
    </div>
  );
}

export default Decks;
