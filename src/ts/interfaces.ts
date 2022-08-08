import { Timestamp } from 'firebase/firestore';

export enum CardField {
  en = 'en',
  ja = 'ja',
  pos = 'pos',
  pronunciation = 'pronunciation',
  id = 'id',
}

export interface CardSchema {
  en: string;
  ja: string;
  pos: string;
  pronunciation: string;

  id?: number;

  metadata?: MetadataSchema;
}

export interface MetadataSchema {
  strength: number;
  skill: string;
  skill_url_title: string;
  similar_translations: string[];
}

export interface DeckSchema {
  cards: CardSchema[];
  created: Timestamp;
  last_edited: Timestamp;
  last_practiced?: Timestamp;
  linked: boolean;
  name: string;

  parent: Parent | null;
  id: string;
}

export interface CuratedConfig {
  name: string;
  startDaysAgo: number;
  endDaysAgo: number;
  lowThreshold: number;
  highThreshold: number;
  numCards: number;
}

export interface Parent {
  id: string;
  name: string;
}

export enum ChildKind {
  Collection = 'c',
  Deck = 'd',
}

export interface Child {
  id: string;
  name: string;
  time_added: Timestamp;
  kind: ChildKind;
}

export interface CollectionSchema {
  created: Timestamp;
  linked: boolean;
  name: string;

  parent: Parent | null;
  children: Child[];
  id: string;
}

export interface Link {
  child_id: string;
  child_kind: ChildKind;
  child_name: string;
  created: Timestamp;
  parent_id: string;
  parent_name: string;
}
