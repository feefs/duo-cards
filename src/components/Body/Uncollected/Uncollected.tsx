import file from 'bootstrap-icons/icons/file.svg';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';

import { auth, firestore } from '../../../ts/firebase';
import { DeckSchema } from '../../../ts/interfaces';
import './Uncollected.scss';

function Uncollected(): JSX.Element {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);
  const [empty, setEmpty] = useState<boolean>(false);
  const [decks, setDecks] = useState<DeckSchema[]>([]);

  useEffect(() => {
    async function fetchDecks() {
      if (!user) {
        return;
      }
      const decks: DeckSchema[] = [];
      const docs = await getDocs(
        query(collection(firestore, 'decks'), where('creator_uid', '==', user.uid), where('linked', '==', false))
      );
      docs.forEach((doc) =>
        decks.push({
          ...doc.data(),
          id: doc.id,
        } as DeckSchema)
      );
      if (decks.length === 0) {
        setEmpty(true);
      }
      decks.sort((a, b) => b.created.toMillis() - a.created.toMillis());
      setDecks(decks);
      setLoading(false);
    }

    fetchDecks();
  }, [user]);

  return (
    <div className="Uncollected">
      <div className="decks">
        {loading ? (
          <div className="text">Loading...</div>
        ) : empty ? (
          <div className="text">{empty ? 'No decks, make one!' : 'User not signed in, decks not available!'}</div>
        ) : (
          decks.map((deck) => (
            <div className="deck-preview" key={deck.id} onClick={() => navigate(`/deck/${deck.id}`)}>
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
        {!loading ? (
          <>
            <div className="info-name">Uncollected Decks</div>
            <hr />
            <div># of decks: {decks.length}</div>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default Uncollected;
