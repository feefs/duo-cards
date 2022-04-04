import { collection, doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useParams } from 'react-router-dom';

import { auth, firestore } from '../../../ts/firebase';
import { CardSchema } from '../../../ts/interfaces';
import PracticeSlider from '../../Sliders/PracticeSlider';
import './Practice.scss';

function Practice(): JSX.Element {
  const [user] = useAuthState(auth);
  const params = useParams();

  const [loading, setLoading] = useState<boolean>(true);
  const [exists, setExists] = useState<boolean>(true);
  const [cards, setCards] = useState<CardSchema[]>([]);
  const [index, setIndex] = useState<number>(0);

  useEffect(() => {
    async function fetchCards() {
      if (!user) {
        return;
      }
      const d = await getDoc(doc(collection(firestore, 'decks'), params.deckId));
      if (!d.exists()) {
        setExists(false);
      } else {
        setCards((d.data().cards as CardSchema[]).map((c: CardSchema, index) => ({ ...c, id: index })));
      }
      setLoading(false);
    }
    fetchCards();
  }, [user, params.deckId]);

  return (
    <div className="Practice">
      {loading ? (
        <div className="text">Loading...</div>
      ) : exists ? (
        <div className="practice-layout">
          <PracticeSlider {...{ cards, index, setIndex }} />
        </div>
      ) : (
        <div className="text">Deck to edit doesn't exist!</div>
      )}
    </div>
  );
}

export default Practice;
