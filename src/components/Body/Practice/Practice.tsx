import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useParams } from 'react-router-dom';

import { fetchDeck } from '../../../data/queries';
import { SliderCard } from '../../../data/types';
import { auth } from '../../../ts/firebase';
import { PracticeSlider } from '../../Sliders';
import './Practice.scss';

function Practice(): JSX.Element {
  const [user] = useAuthState(auth);
  const params = useParams();

  const { isLoading, isError, data } = useQuery(['deck', params.deckId], () => fetchDeck(params.deckId!), {
    enabled: !!user && !!params.deckId,
  });

  const [sliderCards, setSliderCards] = useState<SliderCard[]>([]);
  const [index, setIndex] = useState<number>(0);
  const [flipped, setFlipped] = useState<boolean>(false);

  useEffect(() => {
    if (data) {
      setSliderCards(data.cards.map((card, index) => ({ ...card, key: index })));
    }
  }, [data]);

  return (
    <div className="Practice">
      {isLoading ? (
        <div className="text">Loading...</div>
      ) : isError ? (
        <div className="text">Deck to practice doesn't exist!</div>
      ) : (
        <div className="practice-layout">
          <div className="name">{data.name}</div>
          <PracticeSlider {...{ sliderCards, index, setIndex, flipped }} />
          <button
            className="shuffle"
            onClick={() => {
              const copy = [...sliderCards];
              for (let i = sliderCards.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i - 1));
                [copy[i], copy[j]] = [copy[j], copy[i]];
              }
              setSliderCards(copy);
              setIndex(0);
            }}
          >
            ⤨
          </button>
          <button className="flip" onClick={() => setFlipped(!flipped)}>
            Flip
          </button>
        </div>
      )}
    </div>
  );
}

export default Practice;
