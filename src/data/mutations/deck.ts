import { doc, DocumentReference, Timestamp, writeBatch } from 'firebase/firestore';

import { decksCollection, firestore } from '../firestore';
import { Deck } from '../types';
import { getParentLinkSnapshot } from '../helpers';

export async function submitDeck(
  data: Pick<Deck, 'cards' | 'name'>,
  userId: string,
  deckId?: string
): Promise<DocumentReference<Deck>> {
  const batch = writeBatch(firestore);
  const timestamp = Timestamp.now();
  if (deckId === undefined) {
    const newDocRef = doc(decksCollection);
    batch.set(newDocRef, {
      cards: data.cards,
      created: timestamp,
      creator_uid: userId,
      last_edited: timestamp,
      linked: false,
      name: data.name,
    });
    await batch.commit();
    return newDocRef;
  } else {
    const parentLink = await getParentLinkSnapshot(userId, deckId);
    if (parentLink?.exists()) {
      batch.update(parentLink.ref, { child_name: data.name });
    }
    const docRef = doc(decksCollection, deckId);
    batch.update(docRef, {
      name: data.name,
      cards: data.cards,
      last_edited: timestamp,
    });
    await batch.commit();
    return docRef;
  }
}

export async function unlinkDeck(userId: string, deckId: string): Promise<void> {
  const batch = writeBatch(firestore);
  const parentLink = await getParentLinkSnapshot(userId, deckId);
  if (parentLink?.exists()) {
    batch.delete(parentLink.ref);
  }
  batch.update(doc(decksCollection, deckId), { linked: false });
  await batch.commit();
}
