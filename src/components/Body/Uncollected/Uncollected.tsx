import { useQuery } from '@tanstack/react-query';
import file from 'bootstrap-icons/icons/file.svg';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';

import { fetchUncollected } from '../../../data/queries';
import { auth } from '../../../ts/firebase';
import './Uncollected.scss';

function Uncollected(): JSX.Element {
  const [user, userLoading] = useAuthState(auth);
  const navigate = useNavigate();

  const {
    isLoading,
    isError,
    data: uncollected,
  } = useQuery(['uncollected'], () => fetchUncollected(user?.uid!), {
    enabled: !!user,
  });

  return (
    <div className="Uncollected">
      <div className="decks">
        {!userLoading && !user ? (
          <div className="text">User not signed in, decks not available!</div>
        ) : isLoading ? (
          <div className="text">Loading...</div>
        ) : isError ? (
          <div className="text">Error fetching uncollected decks!</div>
        ) : uncollected.length === 0 ? (
          <div className="text">No decks, make one!</div>
        ) : (
          uncollected.map(({ data: deck, id }) => (
            <div className="deck-preview" key={id} onClick={() => navigate(`/deck/${id}`)}>
              <img className="type-icon" src={file} alt="type-icon" />
              <div className="name">{deck.name}</div>
            </div>
          ))
        )}
      </div>
      <div className="new">
        <button
          className={user ? '' : 'disabled'}
          onClick={() => {
            if (user) navigate('/new');
          }}
        >
          New
        </button>
      </div>
      <div className="uncollected-info">
        {!isLoading && !isError ? (
          <>
            <div className="info-name">Uncollected Decks</div>
            <hr />
            <div># of decks: {uncollected.length}</div>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default Uncollected;
