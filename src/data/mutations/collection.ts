import { addDoc, doc, getDocs, query, Timestamp, where, writeBatch } from 'firebase/firestore';

import { collectionsCollection, firestore, linksCollection } from '../firestore';
import { getParentLinkSnapshot } from '../helpers';
import { ChildKind, Parent } from '../types';

export async function createCollection(collectionName: string, userId: string): Promise<void> {
  await addDoc(collectionsCollection, {
    created: Timestamp.now(),
    creator_uid: userId,
    linked: false,
    name: collectionName,
  });
}

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

export async function deleteCollection(userId: string, collectionId: string): Promise<void> {
  const batch = writeBatch(firestore);
  batch.delete(doc(collectionsCollection, collectionId));
  const parentLinks = await getDocs(
    query(linksCollection, where('creator_uid', '==', userId), where('child_id', '==', collectionId))
  );
  parentLinks.docs.forEach((doc) => {
    if (doc.exists()) {
      batch.delete(doc.ref);
    }
  });
  await batch.commit();
}

export async function renameCollection(newCollectionName: string, userId: string, collectionId: string): Promise<void> {
  const batch = writeBatch(firestore);
  batch.update(doc(collectionsCollection, collectionId), {
    name: newCollectionName,
  });
  const childrenLinks = await getDocs(
    query(linksCollection, where('creator_uid', '==', userId), where('parent_id', '==', collectionId))
  );
  childrenLinks.docs.forEach((doc) => {
    if (doc.exists()) {
      batch.update(doc.ref, { parent_name: newCollectionName });
    }
  });
  const parentLink = await getParentLinkSnapshot(userId, collectionId);
  if (parentLink?.exists()) {
    batch.update(parentLink.ref, { child_name: newCollectionName });
  }
  await batch.commit();
}
