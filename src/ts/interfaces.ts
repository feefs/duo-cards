import { Timestamp } from 'firebase/firestore';

export interface CardSchema {
  en: string;
  id?: number;
  ja: string;
  pos: string;
  pronunciation: string;
}

export interface DeckSchema {
  cards: CardSchema[];
  created: Timestamp;
  last_edited: Timestamp;
  last_practiced?: Timestamp;
  name: string;

  id: string;
}
