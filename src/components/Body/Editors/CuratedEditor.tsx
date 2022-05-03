import { useCallback, useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useLocation } from 'react-router-dom';

import { auth } from '../../../ts/firebase';
import { CardSchema, CuratedConfig } from '../../../ts/interfaces';
import { DUOLINGO_URL } from '../../../ts/local';
import Editor from './Editor';

interface CuratedCard {
  word_string: string;
  strength: number;
  last_practiced_ms: number;
  skill: string;
  skill_url_title: string;
}

export function CuratedEditor(): JSX.Element {
  const [user] = useAuthState(auth);
  const location = useLocation();

  const [loading, setLoading] = useState<boolean>(true);
  const [name, setName] = useState<string>('');
  const [cards, setCards] = useState<CardSchema[]>([]);
  const [nextID, setID] = useState<number>(0);

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

        setCards(
          words.map((curatedCard, index) => ({
            en: '',
            ja: curatedCard.word_string,
            pos: '',
            pronunciation: '',
            id: index,
          }))
        );

        setName(name);
        setLoading(false);
      }
    }

    fetchCards();
  }, [loading, location.state]);

  const newCard = useCallback(() => {
    const result = { en: '', ja: '', pos: '', pronunciation: '', id: nextID };
    setID(nextID + 1);
    return result;
  }, [nextID]);

  return (
    <div className="Editor">
      {loading ? (
        <div className="text">Loading...</div>
      ) : (
        <Editor {...{ user, name, setName, cards, setCards, newCard }} />
      )}
    </div>
  );
}
