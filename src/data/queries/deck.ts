import { doc, getDoc } from 'firebase/firestore';
import { decksCollection } from '../firestore';
import { Deck } from '../types/Deck';

export async function fetchDeck(id: string): Promise<Deck> {
  const response = await getDoc(doc(decksCollection, id));
  if (response.exists()) {
    return response.data();
  } else {
    throw new Error();
  }
}
