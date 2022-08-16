import { Timestamp } from 'firebase/firestore';

import { Card } from '..';

export interface Deck {
  cards: Card[];
  created: Timestamp;
  creator_uid: string;
  last_edited: Timestamp;
  last_practiced?: Timestamp;
  linked: boolean;
  name: string;
}
