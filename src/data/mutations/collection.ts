import { doc, Timestamp, writeBatch } from 'firebase/firestore';

import { collectionsCollection, firestore, linksCollection } from '../firestore';
import { ChildKind, Parent } from '../types';

export async function createSubcollection(subcollectionName: string, parent: Parent, userId: string): Promise<void> {
  const batch = writeBatch(firestore);
  const newDocRef = doc(collectionsCollection);
  batch.set(newDocRef, {
    created: Timestamp.now(),
    creator_uid: userId,
    linked: true,
    name: subcollectionName,
  });
  batch.set(doc(linksCollection), {
    child_id: newDocRef.id,
    child_kind: ChildKind.Collection,
    child_name: subcollectionName,
    created: Timestamp.now(),
    creator_uid: userId,
    parent_id: parent.id,
    parent_name: parent.name,
  });
  await batch.commit();
}
