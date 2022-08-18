import { doc, DocumentReference, Timestamp, writeBatch } from 'firebase/firestore';

import { decksCollection, firestore, linksCollection } from '../firestore';
import { ChildKind, Deck } from '../types';
import { getParentLinkSnapshot } from '../helpers';

export async function deleteDeck(userId: string, deckId: string): Promise<void> {
  const batch = writeBatch(firestore);
  const parentLink = await getParentLinkSnapshot(userId, deckId);
  if (parentLink?.exists()) {
    batch.delete(parentLink.ref);
  }
  batch.delete(doc(decksCollection, deckId));
  await batch.commit();
}

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

export interface linkDeckVariables {
  userId: string;
  collectionName: string;
  collectionId: string;
  deckName: string;
  deckId: string;
}

export async function linkDeck(variables: linkDeckVariables): Promise<void> {
  const { userId, collectionName, collectionId, deckName, deckId } = variables;
  const batch = writeBatch(firestore);
  batch.set(doc(linksCollection), {
    child_id: deckId,
    child_kind: ChildKind.Deck,
    child_name: deckName,
    creator_uid: userId,
    created: Timestamp.now(),
    parent_name: collectionName,
    parent_id: collectionId,
  });
  batch.update(doc(decksCollection, deckId), {
    linked: true,
  });
  await batch.commit();
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
