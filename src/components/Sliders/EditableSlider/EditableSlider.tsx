import { CardField } from '../../../ts/interfaces';
import { Metadata } from '../Metadata';
import { Slider, SliderProps } from '../Slider';

interface EditableSliderProps extends SliderProps {
  setCards: Function;
}

function EditableSlider(props: EditableSliderProps): JSX.Element {
  const { cards, index, setIndex, setCards } = props;

  return (
    <Slider {...{ cards, index, setIndex }}>
      {cards.map((card, i) => {
        const update = (field: CardField) => (e: React.ChangeEvent<HTMLInputElement>) => {
          const value = e.target.value;
          const copy = [...cards];
          switch (field) {
            case 'en':
              copy[i].en = value;
              break;
            case 'ja':
              copy[i].ja = value;
              break;
            case 'pos':
              copy[i].pos = value;
              break;
            case 'pronunciation':
              copy[i].pronunciation = value;
          }
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
            {card.metadata ? <Metadata data={card.metadata} /> : null}
          </div>
        );
      })}
    </Slider>
  );
}

export default EditableSlider;
