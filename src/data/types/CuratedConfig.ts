export interface CuratedConfig {
  name: string;
  startDaysAgo: number;
  endDaysAgo: number;
  lowThreshold: number;
  highThreshold: number;
  numCards: number;
}
