import { getDocs, query, where } from 'firebase/firestore';

import { linksCollection } from '../firestore';
import { ChildKind, Link } from '../types';

export async function fetchChildren(userId: string, parentId: string): Promise<Link[]> {
  const collectionChildren: Link[] = [];
  const deckChildren: Link[] = [];
  const response = await getDocs(
    query(linksCollection, where('creator_uid', '==', userId), where('parent_id', '==', parentId))
  );
  response.docs.forEach((doc) => {
    if (doc.exists()) {
      const link = doc.data();
      if (link.child_kind === ChildKind.Collection) {
        collectionChildren.push(link);
      } else {
        deckChildren.push(link);
      }
    }
  });
  collectionChildren.sort((a, b) => a.child_name.localeCompare(b.child_name));
  deckChildren.sort((a, b) => a.child_name.localeCompare(b.child_name));
  return [...collectionChildren, ...deckChildren];
}
