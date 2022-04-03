import { collection, doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useParams } from 'react-router-dom';

import { auth, firestore } from '../../../ts/firebase';
import { CardSchema } from '../../../ts/interfaces';
import './Practice.scss';

function Practice(): JSX.Element {
  const [user] = useAuthState(auth);
  const params = useParams();

  const [loading, setLoading] = useState<boolean>(true);
  const [exists, setExists] = useState<boolean>(true);
  const [cards, setCards] = useState<CardSchema[]>([]);

  useEffect(() => {
    async function fetchCards() {
      if (!user) {
        return;
      }
      const d = await getDoc(doc(collection(firestore, 'decks'), params.deckId));
      if (!d.exists()) {
        setExists(false);
      } else {
        setCards(d.data().cards as CardSchema[]);
      }
      setLoading(false);
    }
    fetchCards();
  });

  return (
    <div className="Practice">
      {loading ? (
        <div className="text">Loading...</div>
      ) : exists ? (
        <div className="text">Exists!</div>
      ) : (
        <div className="text">Deck to edit doesn't exist!</div>
      )}
    </div>
  );
}

export default Practice;
