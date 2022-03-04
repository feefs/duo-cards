import { useParams } from 'react-router-dom';

import './Deck.scss';

function Deck(): JSX.Element {
  const params = useParams();
  return (
    <div className="Deck">
      <div>Deck view!</div>
      <div>Deck id: {params.deckId}</div>
    </div>
  );
}

export default Deck;
