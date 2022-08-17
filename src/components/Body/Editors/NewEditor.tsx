import { useCallback, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import Editor from './Editor';
import { SliderCard } from '../../../data/types';
import { auth } from '../../../ts/firebase';
import './Editor.scss';

export function NewEditor(): JSX.Element {
  const [user] = useAuthState(auth);

  const [name, setName] = useState<string>('');
  const [sliderCards, setSliderCards] = useState<SliderCard[]>([
    { en: '', ja: '', pos: '', pronunciation: '', key: 0 },
  ]);
  const [nextKey, setNextKey] = useState<number>(1);

  const newCard = useCallback(() => {
    const result = { en: '', ja: '', pos: '', pronunciation: '', key: nextKey };
    setNextKey(nextKey + 1);
    return result;
  }, [nextKey]);

  return (
    <div className="Editor">
      <Editor {...{ user, name, setName, sliderCards, setSliderCards, newCard }} />
    </div>
  );
}
