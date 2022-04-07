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
  const [name, setName] = useState<string>('');
  const [cards, setCards] = useState<CardSchema[]>([]);
  const [index, setIndex] = useState<number>(0);
  const [flipped, setFlipped] = useState<boolean>(false);

  useEffect(() => {
    async function fetchCards() {
      if (!user) {
        return;
      }
      const d = await getDoc(doc(collection(firestore, 'decks'), params.deckId));
      if (!d.exists()) {
        setExists(false);
      } else {
        setName(d.data().name);
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
          <div className="name">{name}</div>
          <PracticeSlider {...{ cards, index, setIndex, flipped }} />
          <button
            className="shuffle"
            onClick={() => {
              const copy = [...cards];
              for (let i = cards.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i - 1));
                [copy[i], copy[j]] = [copy[j], copy[i]];
              }
              setCards(copy);
              setIndex(0);
            }}
          >
            ⤨
          </button>
          <button className="flip" onClick={() => setFlipped(!flipped)}>
            Flip
          </button>
        </div>
      ) : (
        <div className="text">Deck to edit doesn't exist!</div>
      )}
    </div>
  );
}

export default Practice;
