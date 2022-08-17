import { SliderCard } from '../../../data/types';

export interface SliderProps {
  children: React.ReactNode;
  sliderCards: SliderCard[];
  index: number;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
}

export function Slider(props: SliderProps): JSX.Element {
  const { sliderCards, index, setIndex } = props;

  return (
    <>
      <button className="nav-button previous" onClick={() => setIndex(Math.max(0, index - 1))}>
        Left
      </button>
      <button className="nav-button next" onClick={() => props.setIndex(Math.min(sliderCards.length - 1, index + 1))}>
        Right
      </button>
      <div className="slider-cards">{props.children}</div>
    </>
  );
}
