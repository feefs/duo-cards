import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useLocation } from 'react-router-dom';

import { fetchCurated } from '../../../data/queries';
import { CuratedConfig, SliderCard } from '../../../data/types';
import { auth } from '../../../ts/firebase';
import Editor from './Editor';

export function CuratedEditor(): JSX.Element {
  const [user] = useAuthState(auth);
  const location = useLocation();

  const { isLoading, isError, data } = useQuery(
    ['curated'],
    () => fetchCurated((location.state as { config: CuratedConfig }).config),
    {
      enabled: !!user && !!location.state,
    }
  );

  const [name, setName] = useState<string>('');
  const [sliderCards, setSliderCards] = useState<SliderCard[]>([]);
  const [nextKey, setNextKey] = useState<number>(0);

  useEffect(() => {
    if (data) {
      const { sliderCards, name } = data;
      if (sliderCards.length > 0) {
        setSliderCards(sliderCards);
      } else {
        setSliderCards([{ en: '', ja: '', pos: '', pronunciation: '', key: 0 }]);
        setNextKey(1);
      }
      setName(name);
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
        <div className="text">Error fetching curated cards!</div>
      ) : (
        <Editor {...{ user, name, setName, sliderCards, setSliderCards, newCard }} />
      )}
    </div>
  );
}
