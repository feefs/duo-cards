import { Card } from './firestore/Card';

export interface SliderCard extends Card {
  key: number;
  metadata?: Metadata;
}

export interface Metadata {
  strength: number;
  skill: string;
  skill_url_title: string;
  similar_translations: string[];
}
