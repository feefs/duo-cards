import { CardSchema } from '../../../ts/interfaces';

export interface SliderProps {
  children?: JSX.Element[];
  cards: CardSchema[];
  index: number;
  setIndex: Function;
}

export function Slider(props: SliderProps): JSX.Element {
  const { cards, index, setIndex } = props;
  return (
    <>
      <button className="nav-button previous" onClick={() => setIndex(Math.max(0, index - 1))}>
        Left
      </button>
      <button className="nav-button next" onClick={() => props.setIndex(Math.min(cards.length - 1, index + 1))}>
        Right
      </button>
      <div className="slider-cards">{props.children}</div>
    </>
  );
}
