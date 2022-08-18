import { DUOLINGO_URL } from '../../ts/local';
import { CuratedConfig, SliderCard } from '../types';

export async function fetchCurated(config: CuratedConfig): Promise<{ sliderCards: SliderCard[]; name: string }> {
  const { name, startDaysAgo, endDaysAgo, lowThreshold, highThreshold, numCards } = config;
  const response = await fetch(
    `${DUOLINGO_URL}/query?` +
      `start_days_ago=${startDaysAgo}&end_days_ago=${endDaysAgo}` +
      `&low_threshold=${lowThreshold}&high_threshold=${highThreshold}` +
      `&num_cards=${numCards}`
  );
  const cards = (await response.json()) as SliderCard[];
  return { sliderCards: cards.map((card, index) => ({ ...card, key: index })), name };
}
