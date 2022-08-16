import { doc, getDoc } from 'firebase/firestore';
import { decksCollection } from '../firestore';
import { Deck } from '../types';

export async function fetchDeck(deckId: string): Promise<Deck> {
  const response = await getDoc(doc(decksCollection, deckId));
  if (response.exists()) {
    return response.data();
  } else {
    throw new Error();
  }
}
