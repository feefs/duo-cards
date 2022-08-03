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

export interface CollectionSchema {
  entities: CollectionEntitySchema[];
  linked_collections: ConnectionLinkSchema[];
  name: string;

  id: string;
}

export enum CollectionEntityType {
  Collection = 'c',
  Deck = 'd',
}

export interface CollectionEntitySchema {
  type: CollectionEntityType;
  name: string;
  entity_id: string;
}

export interface ConnectionLinkSchema {
  collection_id: string;
  collection_name: string;
}

export interface DeckSchema {
  cards: CardSchema[];
  created: Timestamp;
  last_edited: Timestamp;
  last_practiced?: Timestamp;
  linked_collections: ConnectionLinkSchema[];
  name: string;

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
