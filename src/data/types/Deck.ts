import { Timestamp } from 'firebase/firestore';

import { Card } from './Card';

export interface Deck {
  cards: Card[];
  created: Timestamp;
  last_edited: Timestamp;
  last_practiced?: Timestamp;
  linked: boolean;
  name: string;
}
