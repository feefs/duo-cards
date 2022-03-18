import { useState } from 'react';

import { CardSchema } from '../../../ts/interfaces';
import './Editor.scss';

function Editor(): JSX.Element {
  const [name, setName] = useState<string>('');
  const [cards, setCards] = useState<CardSchema[]>([
    {
      en: '',
      ja: '',
      pos: '',
      pronunciation: '',
    },
  ]);

  return (
    <div className="Editor">
      <div className="ui">
        <input className="name" value={name} placeholder="Deck name" onChange={(e) => setName(e.target.value)} />
        <button className="interact-button delete-card">x</button>
        <button className="interact-button wipe-card">🧹</button>
        <button className="nav-button previous">Left</button>
        <div className="cards" />
        <button className="interact-button new-card">+</button>
        <button className="interact-button submit-deck">✓</button>
        <button className="nav-button next">Right</button>
      </div>
    </div>
  );
}

export default Editor;
