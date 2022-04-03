import { CardField } from '../../../ts/interfaces';
import { Slider, SliderProps } from '../Slider/Slider';

interface EditableSliderProps extends SliderProps {
  setCards: Function;
}

function EditableSlider(props: EditableSliderProps): JSX.Element {
  const { cards, index, setIndex, setCards } = props;
  return (
    <Slider {...{ cards, index, setIndex }}>
      {cards.map((card, i) => {
        const update = (field: CardField) => (e: React.ChangeEvent<HTMLInputElement>) => {
          const copy = [...cards];
          copy[i][field] = e.target.value;
          setCards(copy);
        };
        return (
          <div
            className={'slider-card' + (i === index ? ' active' : '')}
            key={card.id}
            style={{ transform: `translateX(calc(-50% + ${(i - index) * 10}vmin))` }}
          >
            <input value={card.ja} placeholder="ja" onChange={update(CardField.ja)} />
            <input value={card.pronunciation} placeholder="romaji" onChange={update(CardField.pronunciation)} />
            <input value={card.en} placeholder="en" onChange={update(CardField.en)} />
            <input value={card.pos} placeholder="grammar" onChange={update(CardField.pos)} />
          </div>
        );
      })}
    </Slider>
  );
}

export default EditableSlider;
