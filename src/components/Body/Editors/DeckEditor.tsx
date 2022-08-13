import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useParams } from 'react-router-dom';
import { fetchDeck } from '../../../data/queries/deck';

import Editor from './Editor';
import { auth } from '../../../ts/firebase';
import { CardSchema } from '../../../ts/interfaces';

export function DeckEditor(): JSX.Element {
  const [user] = useAuthState(auth);
  const params = useParams();

  const { isLoading, isError, data } = useQuery(['deck', params.deckId], () => fetchDeck(params.deckId!), {
    enabled: !!user && !!params.deckId,
  });

  const [name, setName] = useState<string>('');
  const [cards, setCards] = useState<CardSchema[]>([]);
  const [nextID, setNextID] = useState<number>(0);

  useEffect(() => {
    if (data) {
      setName(data.name);
      setCards(data.cards.map((card, index) => ({ ...card, id: index })));
      setNextID(data.cards.length);
    }
  }, [data]);

  const newCard = useCallback(() => {
    const result = { en: '', ja: '', pos: '', pronunciation: '', id: nextID };
    setNextID(nextID + 1);
    return result;
  }, [nextID]);

  return (
    <div className="Editor">
      {isLoading ? (
        <div className="text">Loading...</div>
      ) : isError ? (
        <div className="text">Deck to edit doesn't exist!</div>
      ) : (
        <Editor {...{ user, name, setName, cards, setCards, newCard }} />
      )}
    </div>
  );
}
