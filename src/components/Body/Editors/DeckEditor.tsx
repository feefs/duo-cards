import { collection, doc, getDoc } from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useParams } from 'react-router-dom';

import { auth, firestore } from '../../../ts/firebase';
import { CardSchema } from '../../../ts/interfaces';
import Editor from './Editor';

export function DeckEditor(): JSX.Element {
  const [user] = useAuthState(auth);
  const params = useParams();

  const [loading, setLoading] = useState<boolean>(true);
  const [exists, setExists] = useState<boolean>(true);
  const [name, setName] = useState<string>('');
  const [cards, setCards] = useState<CardSchema[]>([]);
  const [nextID, setID] = useState<number>(0);

  useEffect(() => {
    async function fetchCards() {
      if (!user) {
        return;
      }
      const d = await getDoc(doc(collection(firestore, 'decks'), params.deckId));
      if (d.exists()) {
        const data = d.data();
        setName(data.name);
        setCards((data.cards as CardSchema[]).map((c: CardSchema, index) => ({ ...c, id: index })));
      } else {
        setExists(false);
      }
      setLoading(false);
    }
    fetchCards();
  }, [user, params.deckId]);

  const newCard = useCallback(() => {
    const result = { en: '', ja: '', pos: '', pronunciation: '', id: nextID };
    setID(nextID + 1);
    return result;
  }, [nextID]);

  return (
    <div className="Editor">
      {loading ? (
        <div className="text">Loading...</div>
      ) : exists ? (
        <Editor {...{ user, name, setName, cards, setCards, newCard }} />
      ) : (
        <div className="text">Deck to edit doesn't exist!</div>
      )}
    </div>
  );
}
