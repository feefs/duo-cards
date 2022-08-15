import { getDocs, query, QueryDocumentSnapshot, where } from 'firebase/firestore';

import { linksCollection } from './firestore';
import { Link } from './types';

export async function getParentLinkSnapshot(
  userId: string,
  childId: string
): Promise<QueryDocumentSnapshot<Link> | null> {
  const response = await getDocs(
    query(linksCollection, where('creator_uid', '==', userId), where('child_id', '==', childId))
  );
  if (response.empty) {
    return null;
  }
  return response.docs[0];
}
