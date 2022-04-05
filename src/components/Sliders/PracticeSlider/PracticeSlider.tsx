import { useState } from 'react';

import { Slider, SliderProps } from '../Slider';

function PracticeSlider(props: SliderProps): JSX.Element {
  const { cards, index, setIndex } = props;

  const [jaFocus] = useState<boolean>(true);
  return (
    <Slider {...{ cards, index, setIndex }}>
      {cards.map((card, i) => {
        return (
          <div
            className={'slider-card' + (i === index ? ' active' : '')}
            key={card.id}
            style={{ transform: `translateX(calc(-50% + ${(i - index) * 10}vmin))` }}
          >
            {jaFocus ? <div>{card.ja}</div> : <div>{card.en}</div>}
          </div>
        );
      })}
    </Slider>
  );
}

export default PracticeSlider;
