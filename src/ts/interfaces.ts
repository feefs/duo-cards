import { Timestamp } from 'firebase/firestore';

export enum CardField {
  en = 'en',
  ja = 'ja',
  pos = 'pos',
  pronunciation = 'pronunciation',
  id = 'id',
}

export type CardSchema = {
  [key in CardField]: string | number;
};

export interface DeckSchema {
  cards: CardSchema[];
  created: Timestamp;
  last_edited: Timestamp;
  last_practiced?: Timestamp;
  name: string;

  id: string;
}
