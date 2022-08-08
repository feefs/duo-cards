import { collection, deleteDoc, doc, getDoc, getDocs, query, Timestamp, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate, useParams } from 'react-router-dom';

import { CollectionModal } from '../../Modals';
import { auth, firestore } from '../../../ts/firebase';
import { DeckSchema, Link, Parent } from '../../../ts/interfaces';
import './Deck.scss';

function formatDate(timestamp: Timestamp): string {
  return timestamp.toDate().toLocaleString();
}

function Deck(): JSX.Element {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const params = useParams();

  const [loading, setLoading] = useState<boolean>(true);
  const [exists, setExists] = useState<boolean>(true);
  const [deleted, setDeleted] = useState<boolean>(false);
  const [deck, setDeck] = useState<DeckSchema>({
    cards: [],
    created: Timestamp.fromMillis(0),
    last_edited: Timestamp.fromMillis(0),
    last_practiced: Timestamp.fromMillis(0),
    linked: false,
    parent: null,
    name: '',
    id: '',
  });

  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    async function fetchCards() {
      if (!user) {
        return;
      }
      if (!params.deckId) {
        setExists(false);
        setLoading(false);
        return;
      }
      const deckDoc = await getDoc(doc(collection(firestore, 'decks'), params.deckId));
      if (!deckDoc.exists()) {
        setExists(false);
      } else {
        let parent: Parent | null = null;
        const result = await getDocs(
          query(
            collection(firestore, 'links'),
            where('creator_uid', '==', user.uid),
            where('child_id', '==', deckDoc.id)
          )
        );
        const doc = result.docs.map((doc) => doc).shift();
        if (doc?.exists()) {
          const link = doc.data() as Link;
          parent = { id: link.parent_id, name: link.parent_name };
        }
        setDeck({ ...deckDoc.data(), parent, id: deckDoc.id } as DeckSchema);
      }
      setLoading(false);
    }

    fetchCards();
  }, [user, params.deckId]);

  return (
    <>
      <div className="Deck">
        <div className="cards">
          {loading ? (
            <div className="text">Loading...</div>
          ) : !exists ? (
            <div className="text">Deck doesn't exist!</div>
          ) : (
            deck.cards.map((card, index) => (
              <div className="card" key={index}>
                <div className="card-text">
                  <div />
                  <div>{card.ja}</div>
                  <div>{card.pronunciation}</div>
                  <div>{card.en}</div>
                  <div>{card.pos}</div>
                  <div />
                </div>
              </div>
            ))
          )}
        </div>
        <div className="deck-actions">
          <button className="practice-button" onClick={() => navigate(`/practice/${params.deckId}`)}>
            Practice
          </button>
          <button className="edit-button" onClick={() => navigate(`/edit/${params.deckId}`)}>
            Edit
          </button>
        </div>
        <div className="deck-info">
          {!loading ? (
            <>
              <div className="info-name">{deck.name}</div>
              <hr />
              <div># of cards: {deck.cards.length}</div>
              <div>
                <div>Last practiced:</div>
                <div>{deck.last_practiced ? formatDate(deck.last_practiced) : 'Never'}</div>
              </div>
              <div>
                <div>Last edited:</div>
                <div>{formatDate(deck.last_edited)}</div>
              </div>
              <div>
                <div>Time created:</div>
                <div>{formatDate(deck.created)}</div>
              </div>
              <hr />
              <button className="add-to-collection" onClick={() => setOpen(true)}>
                Add to Collection
              </button>
              <button
                className={'delete-deck' + (deleted ? ' disabled' : '')}
                onClick={async () => {
                  if (!deleted) {
                    setDeleted(true);
                    await deleteDoc(doc(collection(firestore, 'decks'), params.deckId));
                    navigate('/');
                  }
                }}
              >
                Delete Deck
              </button>
            </>
          ) : null}
        </div>
      </div>
      <CollectionModal {...{ open, onClose: () => setOpen(false), user, deck, setDeck }} />
    </>
  );
}

export default Deck;
