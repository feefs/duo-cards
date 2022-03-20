import { useState } from 'react';

import { CardField, CardSchema } from '../../../ts/interfaces';
import './Editor.scss';

function emptyCard(): CardSchema {
  return { en: '', ja: '', pos: '', pronunciation: '' };
}

function Editor(): JSX.Element {
  const [name, setName] = useState<string>('');
  const [cards, setCards] = useState<CardSchema[]>([emptyCard()]);
  const [index, setIndex] = useState<number>(0);

  return (
    <div className="Editor">
      <div className="ui">
        <input className="name" value={name} placeholder="Deck name" onChange={(e) => setName(e.target.value)} />
        <button
          className="interact-button delete-card"
          onClick={() => {
            setCards([...cards.slice(0, index), ...cards.slice(index + 1)]);
            setIndex(Math.min(Math.max(0, index - 1), cards.length - 1));
          }}
        >
          x
        </button>
        <button
          className="interact-button wipe-card"
          onClick={() => setCards([...cards.slice(0, index), emptyCard(), ...cards.slice(index + 1)])}
        >
          🧹
        </button>
        <button className="nav-button previous" onClick={() => setIndex(Math.max(0, index - 1))}>
          Left
        </button>
        <button
          className="interact-button new-card"
          onClick={() => {
            setCards([...cards, emptyCard()]);
            setIndex(cards.length);
          }}
        >
          +
        </button>
        <button className="interact-button submit-deck">✓</button>
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
                key={i}
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
