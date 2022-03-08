import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import { auth, firestore } from '../../../ts/firebase';
import { DeckSchema } from '../../../ts/interfaces';
import './Decks.scss';

function Decks(): JSX.Element {
  const [user, ,] = useAuthState(auth);
  const [decks, setDecks] = useState<DeckSchema[]>([]);

  useEffect(() => {
    async function fetchDecks() {
      if (!user) {
        return;
      }
      const decks: DeckSchema[] = [];
      (await getDocs(collection(firestore, 'decks'))).forEach((doc) =>
        decks.push({
          ...doc.data(),
          id: doc.id,
        } as DeckSchema)
      );
      setDecks(decks);
    }

    fetchDecks();
  }, [user]);

  return (
    <div className="Decks">
      <div className="decks">
        {decks.map((deck) => (
          <div className="deck-preview" key={deck.id}>
            <div className="name">{deck.name}</div>
          </div>
        ))}
      </div>
      <div className="new">New</div>
      <div className="curated">Curated</div>
    </div>
  );
}

export default Decks;
