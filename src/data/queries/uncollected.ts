import { getDocs, query, where } from 'firebase/firestore';

import { decksCollection } from '../firestore';
import { Deck, WithId } from '../types';

export async function fetchUncollected(userId: string): Promise<WithId<Deck>[]> {
  const response = await getDocs(
    query(decksCollection, where('creator_uid', '==', userId), where('linked', '==', false))
  );
  const result: WithId<Deck>[] = [];
  response.docs.forEach((doc) => {
    if (doc.exists()) {
      result.push({ data: doc.data(), id: doc.id });
    }
  });
  result.sort((a, b) => b.data.created.toMillis() - a.data.created.toMillis());
  return result;
}
