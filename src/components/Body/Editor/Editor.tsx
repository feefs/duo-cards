import { User } from 'firebase/auth';
import { addDoc, collection, doc, Timestamp, updateDoc } from 'firebase/firestore';
import { useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { firestore } from '../../../ts/firebase';
import { CardSchema } from '../../../ts/interfaces';
import EditableSlider from '../../Sliders/EditableSlider';
import './Editor.scss';

interface EditorProps {
  user: User | null | undefined;
  name: string;
  setName: Function;
  cards: CardSchema[];
  setCards: Function;
  newCard: Function;
}

function Editor(props: EditorProps): JSX.Element {
  const { user, name, setName, cards, setCards, newCard } = props;

  const navigate = useNavigate();
  const params = useParams();

  const [index, setIndex] = useState<number>(0);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const canSubmit = useCallback(() => {
    return user && name && !submitted;
  }, [user, name, submitted]);

  const submitDeck = useCallback(async () => {
    setSubmitted(true);
    const cardsCopy = [...cards] as any[];
    cardsCopy.forEach((card) => {
      delete card.id;
    });
    const currentTimestamp = Timestamp.now();
    const collectionRef = collection(firestore, 'decks');
    if (params.deckId) {
      await updateDoc(doc(collectionRef, params.deckId), {
        name,
        cards: cardsCopy,
        last_edited: currentTimestamp,
      });
      navigate(`/deck/${params.deckId}`);
    } else {
      const d = await addDoc(collectionRef, {
        creator_uid: user ? user.uid : '',
        name,
        cards: cardsCopy,
        created: currentTimestamp,
        last_edited: currentTimestamp,
      });
      navigate(`/deck/${d.id}`);
    }
  }, [cards, params.deckId, user, name, navigate]);

  return (
    <div className="Editor">
      <input className="name" value={name} placeholder="Deck name" onChange={(e) => setName(e.target.value)} />
      <button
        className="interact-button delete-card"
        onClick={() => {
          if (cards.length > 1) {
            setCards([...cards.slice(0, index), ...cards.slice(index + 1)]);
            setIndex(Math.min(Math.max(0, index - 1), cards.length - 1));
          }
        }}
      >
        x
      </button>
      <button
        className="interact-button wipe-card"
        onClick={() => setCards([...cards.slice(0, index), newCard(), ...cards.slice(index + 1)])}
      >
        🧹
      </button>
      <button
        className="interact-button new-card"
        onClick={() => {
          setCards([...cards.slice(0, index + 1), newCard(), ...cards.slice(index + 1)]);
          setTimeout(() => setIndex(index + 1), 100);
        }}
      >
        +
      </button>
      <button
        className={'interact-button submit-deck' + (canSubmit() ? '' : ' disabled')}
        onClick={() => {
          if (canSubmit()) submitDeck();
        }}
      >
        ✓
      </button>
      <EditableSlider {...{ cards, setCards, index, setIndex }} />
    </div>
  );
}

export default Editor;
