import { useState } from 'react';
import objectHash from 'object-hash';

import { Slider, SliderProps } from '../Slider';
import './PracticeSlider.scss';

interface PracticeSliderProps extends Omit<SliderProps, 'children'> {
  flipped: boolean;
}

export function PracticeSlider(props: PracticeSliderProps): JSX.Element {
  const { sliderCards, index, setIndex, flipped } = props;

  const [jaFocus, setJaFocus] = useState<boolean>(true);
  const [pronunciation, setPronunciation] = useState<boolean>(false);

  return (
    <>
      <Slider {...{ sliderCards, index, setIndex }}>
        {sliderCards.map((card, i) => (
          <div
            className={'slider-card' + (i === index ? ' active' : '')}
            key={objectHash(card)}
            style={{ transform: `translateX(calc(-50% + ${(i - index) * 10}vmin))` }}
          >
            {flipped ? (
              <>
                <div>{jaFocus ? card.en : card.ja}</div>
                <div>{card.pronunciation}</div>
                <div>{card.pos}</div>
              </>
            ) : (
              <>
                <div>{jaFocus ? card.ja : card.en}</div>
                {pronunciation ? <div>{card.pronunciation}</div> : null}
              </>
            )}
          </div>
        ))}
      </Slider>
      <button
        className="toggle-language"
        onClick={() => {
          setJaFocus(!jaFocus);
          setPronunciation(false);
        }}
      >
        {jaFocus ? '🇯🇵' : '🇺🇸'}
      </button>
      <button
        className={'show-pronunciation' + (jaFocus && !flipped ? '' : ' disabled')}
        onClick={() => {
          if (jaFocus && !flipped) setPronunciation(!pronunciation);
        }}
      >
        Show Pronunciation
      </button>
    </>
  );
}
