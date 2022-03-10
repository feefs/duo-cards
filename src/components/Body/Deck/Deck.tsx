import { collection, doc, getDoc, Timestamp } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useParams } from 'react-router-dom';

import { auth, firestore } from '../../../ts/firebase';
import { DeckSchema } from '../../../ts/interfaces';
import './Deck.scss';

function Deck(): JSX.Element {
  const [user, loading] = useAuthState(auth);
  const params = useParams();

  const [deck, setDeck] = useState<DeckSchema>({
    cards: [],
    created: Timestamp.fromMillis(0),
    last_edited: Timestamp.fromMillis(0),
    last_practiced: Timestamp.fromMillis(0),
    name: '',
    id: '',
  });
  const [exists, setExists] = useState<boolean>(true);

  useEffect(() => {
    async function fetchCards() {
      if (!user || !params.deckId) {
        return;
      }
      const d = await getDoc(doc(collection(firestore, 'decks'), params.deckId));
      if (!d.exists()) {
        setExists(false);
      } else {
        setDeck(d.data() as DeckSchema);
      }
    }

    fetchCards();
  }, [user, params.deckId]);

  return (
    <div className="Deck">
      <div className="cards">
        {loading || (user && exists) ? (
          deck.cards.map((card, index) => (
            <div className="card" key={index}>
              <div className="card-text">
                <div />
                <div>{card.ja}</div>
                <div>{card.pronunciation}</div>
                <div>{card.en}</div>
                <div>{card.pos}</div>
                <div />
              </div>
            </div>
          ))
        ) : (
          <div className="invalid-text">Deck doesn't exist!</div>
        )}
      </div>
      <div className="deck-actions">ACTIONS</div>
      <div className="deck-info">INFO</div>
    </div>
  );
}

export default Deck;
