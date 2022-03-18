import { collection, doc, getDoc, Timestamp } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate, useParams } from 'react-router-dom';

import { auth, firestore } from '../../../ts/firebase';
import { DeckSchema } from '../../../ts/interfaces';
import './Deck.scss';

function formatDate(timestamp: Timestamp): string {
  return timestamp.toDate().toLocaleString();
}

function Deck(): JSX.Element {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
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
      <div className="deck-actions">
        <button className="practice-button" onClick={() => navigate(`/duo-cards/practice/${params.deckId}`)}>
          Practice
        </button>
        <button className="edit-button" onClick={() => navigate(`/duo-cards/edit/${params.deckId}`)}>
          Edit
        </button>
      </div>
      <div className="deck-info">
        {deck.name ? (
          <>
            <div className="info-name">{deck.name}</div>
            <hr />
            <div># of cards: {deck.cards.length}</div>
            <div>
              <div>Last practiced:</div>
              <div>{deck.last_practiced ? formatDate(deck.last_practiced) : 'Never'}</div>
            </div>
            <div>
              <div>Last edited:</div>
              <div>{formatDate(deck.last_edited)}</div>
            </div>
            <div>
              <div>Time created:</div>
              <div>{formatDate(deck.created)}</div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default Deck;
