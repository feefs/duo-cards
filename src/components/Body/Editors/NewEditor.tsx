import { useCallback, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import { auth } from '../../../ts/firebase';
import { CardSchema } from '../../../ts/interfaces';
import Editor from './Editor';
import './Editor.scss';

export function NewEditor(): JSX.Element {
  const [user] = useAuthState(auth);

  const [name, setName] = useState<string>('');
  const [cards, setCards] = useState<CardSchema[]>([{ en: '', ja: '', pos: '', pronunciation: '', id: 0 }]);
  const [nextID, setID] = useState<number>(1);

  const newCard = useCallback(() => {
    const result = { en: '', ja: '', pos: '', pronunciation: '', id: nextID };
    setID(nextID + 1);
    return result;
  }, [nextID]);

  return (
    <div className="Editor">
      <Editor {...{ user, name, setName, cards, setCards, newCard }} />
    </div>
  );
}
