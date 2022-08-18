import { useMutation } from '@tanstack/react-query';
import { User } from 'firebase/auth';
import { useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { submitDeck } from '../../../data/mutations';
import { SliderCard } from '../../../data/types';
import { EditableSlider } from '../../Sliders';
import './Editor.scss';

interface EditorProps {
  user: User | null | undefined;
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  sliderCards: SliderCard[];
  setSliderCards: React.Dispatch<React.SetStateAction<SliderCard[]>>;
  newCard: () => SliderCard;
}

function Editor(props: EditorProps): JSX.Element {
  const { user, name, setName, sliderCards, setSliderCards, newCard } = props;

  const navigate = useNavigate();
  const params = useParams();

  const [index, setIndex] = useState<number>(0);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const canSubmit = useCallback(() => {
    return !!(user && name && !submitted);
  }, [user, name, submitted]);

  const mutation = useMutation(
    () => {
      setSubmitted(true);
      return submitDeck(
        { cards: sliderCards.map(({ key, metadata, ...card }) => card), name },
        user?.uid!,
        params.deckId
      );
    },
    {
      onSuccess: (docRef) => {
        navigate(`/deck/${docRef.id}`);
      },
    }
  );

  return (
    <div className="editor-layout">
      <input className="name" value={name} placeholder="Deck name" onChange={(e) => setName(e.target.value)} />
      <button
        className="interact-button delete-card"
        onClick={() => {
          if (sliderCards.length > 1) {
            setSliderCards([...sliderCards.slice(0, index), ...sliderCards.slice(index + 1)]);
            setIndex(Math.min(Math.max(0, index - 1), sliderCards.length - 1));
          }
        }}
      >
        x
      </button>
      <button
        className="interact-button wipe-card"
        onClick={() => setSliderCards([...sliderCards.slice(0, index), newCard(), ...sliderCards.slice(index + 1)])}
      >
        🧹
      </button>
      <button
        className="interact-button new-card"
        onClick={() => {
          setSliderCards([...sliderCards.slice(0, index + 1), newCard(), ...sliderCards.slice(index + 1)]);
          setTimeout(() => setIndex(index + 1), 100);
        }}
      >
        +
      </button>
      <button
        className={'interact-button submit-deck' + (canSubmit() ? '' : ' disabled')}
        onClick={() => {
          if (canSubmit()) mutation.mutate();
        }}
      >
        ✓
      </button>
      <button className="end" onClick={() => setIndex(sliderCards.length - 1)}>
        →
      </button>
      <EditableSlider {...{ sliderCards, setSliderCards, index, setIndex }} />
    </div>
  );
}

export default Editor;
