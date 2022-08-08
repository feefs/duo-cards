import { User } from 'firebase/auth';
import { collection, doc, getDocs, query, Timestamp, where, writeBatch } from 'firebase/firestore';
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

interface FirebaseCardSchema {
  en: string;
  ja: string;
  pos: string;
  pronunciation: string;
  id?: string;
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
    if (!user || !name) {
      return;
    }
    setSubmitted(true);
    const cardsCopy = [...cards] as FirebaseCardSchema[];
    cardsCopy.forEach((card) => {
      delete card.id;
    });
    const currentTimestamp = Timestamp.now();
    const collectionRef = collection(firestore, 'decks');

    const batch = writeBatch(firestore);
    const newDocRef = doc(collectionRef);
    if (params.deckId) {
      batch.update(doc(collectionRef, params.deckId), {
        name,
        cards: cardsCopy,
        last_edited: currentTimestamp,
      });
      const result = await getDocs(
        query(
          collection(firestore, 'links'),
          where('creator_uid', '==', user.uid),
          where('child_id', '==', params.deckId)
        )
      );
      const d = result.docs.map((doc) => doc).shift();
      if (d?.exists()) {
        batch.update(d.ref, { child_name: name });
      }
      await batch.commit();
      navigate(`/deck/${params.deckId}`);
    } else {
      batch.set(newDocRef, {
        cards: cardsCopy,
        created: currentTimestamp,
        creator_uid: user.uid,
        last_edited: currentTimestamp,
        linked: false,
        name,
      });
      await batch.commit();
      navigate(`/deck/${newDocRef.id}`);
    }
  }, [cards, params.deckId, user, name, navigate]);

  return (
    <div className="editor-layout">
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
      <button className="end" onClick={() => setIndex(cards.length - 1)}>
        →
      </button>
      <EditableSlider {...{ cards, setCards, index, setIndex }} />
    </div>
  );
}

export default Editor;
