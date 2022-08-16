import { Timestamp } from 'firebase/firestore';

import { ChildKind } from '..';

export interface Link {
  child_id: string;
  child_kind: ChildKind;
  child_name: string;
  created: Timestamp;
  creator_uid: string;
  parent_id: string;
  parent_name: string;
}
