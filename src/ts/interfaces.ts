import { Timestamp } from 'firebase/firestore';

export interface DeckSchema {
  cards: any[];
  created: Timestamp;
  last_edited: Timestamp;
  last_practiced?: Timestamp;
  name: string;

  id: string;
}
