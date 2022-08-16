import { doc, getDoc } from 'firebase/firestore';
import { collectionsCollection } from '../firestore';
import { Collection } from '../types';

export async function fetchCollection(collectionId: string): Promise<Collection> {
  const response = await getDoc(doc(collectionsCollection, collectionId));
  if (response.exists()) {
    return response.data();
  } else {
    throw new Error();
  }
}
