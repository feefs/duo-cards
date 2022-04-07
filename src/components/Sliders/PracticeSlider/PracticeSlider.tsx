import { useState } from 'react';

import { Slider, SliderProps } from '../Slider';
import './PracticeSlider.scss';

interface PracticeSliderProps extends SliderProps {
  flipped: boolean;
}

function PracticeSlider(props: PracticeSliderProps): JSX.Element {
  const { cards, index, setIndex, flipped } = props;

  const [jaFocus, setJaFocus] = useState<boolean>(true);
  const [pronunciation, setPronunciation] = useState<boolean>(false);

  return (
    <>
      <Slider {...{ cards, index, setIndex }}>
        {cards.map((card, i) => {
          return (
            <div
              className={'slider-card' + (i === index ? ' active' : '')}
              key={card.id}
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
          );
        })}
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

export default PracticeSlider;
