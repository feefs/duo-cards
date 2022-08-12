import { collection, CollectionReference, DocumentData } from 'firebase/firestore';

import { firestore } from '../ts/firebase';
import { Deck } from './types/Deck';

function createCollection<T = DocumentData>(name: string): CollectionReference<T> {
  return collection(firestore, name) as CollectionReference<T>;
}

export const decksCollection = createCollection<Deck>('decks');
