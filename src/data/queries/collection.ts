import { doc, getDoc, getDocs, query, Timestamp, where } from 'firebase/firestore';

import { collectionsCollection } from '../firestore';
import { Collection } from '../types';

export const UNCOLLECTED_COLLECTION: Collection = {
  created: Timestamp.fromMillis(0),
  creator_uid: '',
  linked: false,
  name: 'Uncollected',
};

export const UNCOLLECTED_ID = 'UNCOLLECTED';

export async function fetchCollection(collectionId: string): Promise<Collection> {
  const response = await getDoc(doc(collectionsCollection, collectionId));
  if (response.exists()) {
    return response.data();
  } else {
    throw new Error();
  }
}

export async function fetchCollectionsWithUncollected(userId: string): Promise<{ data: Collection; id: string }[]> {
  const response = await getDocs(
    query(collectionsCollection, where('creator_uid', '==', userId), where('linked', '==', false))
  );
  const result: { data: Collection; id: string }[] = [];
  response.docs.forEach((doc) => {
    if (doc.exists()) {
      result.push({ data: doc.data(), id: doc.id });
    }
  });
  return [...result, { data: UNCOLLECTED_COLLECTION, id: UNCOLLECTED_ID }];
}

export async function fetchAllCollections(userId: string): Promise<{ data: Collection; id: string }[]> {
  const response = await getDocs(query(collectionsCollection, where('creator_uid', '==', userId)));
  const result: { data: Collection; id: string }[] = [];
  response.docs.forEach((doc) => {
    if (doc.exists()) {
      result.push({ data: doc.data(), id: doc.id });
    }
  });
  return result;
}
