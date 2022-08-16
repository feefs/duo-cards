import { Timestamp } from 'firebase/firestore';

export interface Collection {
  created: Timestamp;
  creator_uid: string;
  linked: boolean;
  name: string;
}
