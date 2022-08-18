import { CuratedConfig } from '../data/types';

export const CURATED_ENABLED = false;

export const DUOLINGO_URL = 'http://localhost:8000';

export const CURATED_CONFIGURATIONS: CuratedConfig[] = [
  {
    name: 'Recently Practiced',
    startDaysAgo: 7,
    endDaysAgo: 0,
    lowThreshold: 0,
    highThreshold: 1,
    numCards: 10,
  },
  {
    name: 'Weak but Recent',
    startDaysAgo: 84,
    endDaysAgo: 0,
    lowThreshold: 0,
    highThreshold: 0.95,
    numCards: 15,
  },
  {
    name: 'Freshly Learned',
    startDaysAgo: 7,
    endDaysAgo: 0,
    lowThreshold: 0,
    highThreshold: 0.5,
    numCards: 10,
  },
];
