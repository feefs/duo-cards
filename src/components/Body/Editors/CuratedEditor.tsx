import { useCallback, useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useLocation } from 'react-router-dom';

import { CuratedConfig, Metadata, SliderCard } from '../../../data/types';
import { auth } from '../../../ts/firebase';
import { DUOLINGO_URL } from '../../../ts/local';
import Editor from './Editor';

interface CuratedCard {
  en: string;
  ja: string;
  pos: string;
  pronunciation: string;
  metadata: Metadata;
}

export function CuratedEditor(): JSX.Element {
  const [user] = useAuthState(auth);
  const location = useLocation();

  const [loading, setLoading] = useState<boolean>(true);
  const [name, setName] = useState<string>('');
  const [sliderCards, setSliderCards] = useState<SliderCard[]>([]);
  const [nextKey, setNextKey] = useState<number>(0);

  useEffect(() => {
    async function fetchCards() {
      const state = location.state as { config: CuratedConfig };
      if (loading && state.config) {
        const { name, startDaysAgo, endDaysAgo, lowThreshold, highThreshold, numCards } = state.config;
        const response = await fetch(
          `${DUOLINGO_URL}/query?` +
            `start_days_ago=${startDaysAgo}&end_days_ago=${endDaysAgo}` +
            `&low_threshold=${lowThreshold}&high_threshold=${highThreshold}` +
            `&num_cards=${numCards}`
        );
        const words = (await response.json()) as CuratedCard[];

        if (words.length) {
          setSliderCards(words.map((curatedCard, index) => ({ ...curatedCard, key: index })));
          setNextKey(words.length);
        } else {
          setSliderCards([{ en: '', ja: '', pos: '', pronunciation: '', key: 0 }]);
          setNextKey(1);
        }

        setName(name);
        setLoading(false);
      }
    }

    fetchCards();
  }, [loading, location.state]);

  const newCard = useCallback(() => {
    const result = { en: '', ja: '', pos: '', pronunciation: '', key: nextKey };
    setNextKey(nextKey + 1);
    return result;
  }, [nextKey]);

  return (
    <div className="Editor">
      {loading ? (
        <div className="text">Loading...</div>
      ) : (
        <Editor {...{ user, name, setName, sliderCards, setSliderCards, newCard }} />
      )}
    </div>
  );
}
