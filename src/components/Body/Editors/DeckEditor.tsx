import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useParams } from 'react-router-dom';

import Editor from './Editor';
import { fetchDeck } from '../../../data/queries';
import { SliderCard } from '../../../data/types';
import { auth } from '../../../ts/firebase';

export function DeckEditor(): JSX.Element {
  const [user] = useAuthState(auth);
  const params = useParams();

  const { isLoading, isError, data } = useQuery(['deck', params.deckId], () => fetchDeck(params.deckId!), {
    enabled: !!user && !!params.deckId,
  });

  const [name, setName] = useState<string>('');
  const [sliderCards, setSliderCards] = useState<SliderCard[]>([]);
  const [nextKey, setNextKey] = useState<number>(0);

  useEffect(() => {
    if (data) {
      setName(data.name);
      setSliderCards(data.cards.map((card, index) => ({ ...card, key: index })));
      setNextKey(data.cards.length);
    }
  }, [data]);

  const newCard = useCallback(() => {
    const result = { en: '', ja: '', pos: '', pronunciation: '', key: nextKey };
    setNextKey(nextKey + 1);
    return result;
  }, [nextKey]);

  return (
    <div className="Editor">
      {isLoading ? (
        <div className="text">Loading...</div>
      ) : isError ? (
        <div className="text">Deck to edit doesn't exist!</div>
      ) : (
        <Editor {...{ user, name, setName, sliderCards, setSliderCards, newCard }} />
      )}
    </div>
  );
}
