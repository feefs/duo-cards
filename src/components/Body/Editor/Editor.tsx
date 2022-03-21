import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { useCallback, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';

import { auth, firestore } from '../../../ts/firebase';
import { CardField, CardSchema } from '../../../ts/interfaces';
import './Editor.scss';

function Editor(): JSX.Element {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const [name, setName] = useState<string>('');
  const [cards, setCards] = useState<CardSchema[]>([{ en: '', ja: '', pos: '', pronunciation: '', id: 0 }]);
  const [index, setIndex] = useState<number>(0);
  const [nextID, setID] = useState<number>(1);

  const newCard = useCallback(() => {
    const result = { en: '', ja: '', pos: '', pronunciation: '', id: nextID };
    setID(nextID + 1);
    return result;
  }, [nextID]);

  const canSubmit = useCallback(() => {
    return user && name;
  }, [user, name]);

  const submitDeck = useCallback(async () => {
    const copy = [...cards] as any[];
    copy.forEach((card) => {
      if (card.id) {
        delete card.id;
      }
    });
    const currentTimestamp = Timestamp.now();
    const doc = await addDoc(collection(firestore, 'decks'), {
      creator_uid: user ? user.uid : '',
      name,
      cards: copy,
      created: currentTimestamp,
      last_edited: currentTimestamp,
    });
    navigate(`/deck/${doc.id}`);
  }, [user, navigate, name, cards]);

  return (
    <div className="Editor">
      <div className="ui">
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
        <button className="nav-button previous" onClick={() => setIndex(Math.max(0, index - 1))}>
          Left
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
        <button className="nav-button next" onClick={() => setIndex(Math.min(cards.length - 1, index + 1))}>
          Right
        </button>
        <div className="cards">
          {cards.map((card, i) => {
            const update = (field: CardField) => (e: React.ChangeEvent<HTMLInputElement>) => {
              const copy = [...cards];
              copy[i][field] = e.target.value;
              setCards(copy);
            };
            return (
              <div
                className={'card' + (i === index ? ' active' : '')}
                key={card.id}
                style={{ transform: `translateX(calc(-50% + ${(i - index) * 10}vmin))` }}
              >
                <input value={card.ja} placeholder="ja" onChange={update(CardField.ja)} />
                <input value={card.pronunciation} placeholder="romaji" onChange={update(CardField.pronunciation)} />
                <input value={card.en} placeholder="en" onChange={update(CardField.en)} />
                <input value={card.pos} placeholder="grammar" onChange={update(CardField.pos)} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Editor;
