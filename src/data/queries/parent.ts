import { getParentLinkSnapshot } from '../helpers';
import { Parent } from '../types';

export async function fetchParent(userId: string, childId: string): Promise<Parent | null> {
  const parentLink = await getParentLinkSnapshot(userId, childId);
  if (!parentLink?.exists()) {
    return null;
  }
  const data = parentLink.data();
  return { id: data.parent_id, name: data.parent_name };
}
