import { User } from 'firebase/auth';
import {
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  Timestamp,
  where,
  writeBatch,
} from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate, useParams } from 'react-router-dom';

import Modal from '../../Modal';
import { auth, firestore } from '../../../ts/firebase';
import {
  CollectionEntitySchema,
  CollectionEntityType,
  CollectionSchema,
  ConnectionLinkSchema,
  DeckSchema,
} from '../../../ts/interfaces';
import './Deck.scss';

function formatDate(timestamp: Timestamp): string {
  return timestamp.toDate().toLocaleString();
}

interface CollectionModalProps {
  user: User | null | undefined;
  closeModal: Function;
  deck: DeckSchema;
  setDeck: Function;
}

function CollectionModal(props: CollectionModalProps): JSX.Element {
  const { user, closeModal, deck, setDeck } = props;

  const [loading, setLoading] = useState<boolean>(true);
  const [empty, setEmpty] = useState<boolean>(false);
  const [selected, setSelected] = useState<boolean>(false);
  const [collections, setCollections] = useState<CollectionSchema[]>([]);

  useEffect(() => {
    async function fetchCollections() {
      if (!user) {
        return;
      }
      const collections: CollectionSchema[] = [];
      const result = await getDocs(query(collection(firestore, 'collections'), where('creator_uid', '==', user.uid)));
      result.forEach((doc) => {
        collections.push({
          ...doc.data(),
          id: doc.id,
        } as CollectionSchema);
      });
      if (collections.length === 0) {
        setEmpty(true);
      }
      setCollections(collections);
      setLoading(false);
    }

    fetchCollections();
  }, [user]);

  const addCollectionLink = useCallback(
    async (c: CollectionSchema) => {
      setSelected(true);
      const currentTimestamp = Timestamp.now();
      const batch = writeBatch(firestore);
      const collectionEntity: CollectionEntitySchema = {
        entity_id: deck.id,
        name: deck.name,
        time_added: currentTimestamp,
        type: CollectionEntityType.Deck,
      };
      batch.update(doc(collection(firestore, 'collections'), c.id), {
        entities: arrayUnion(collectionEntity),
      });
      const connectionLink: ConnectionLinkSchema = {
        collection_id: c.id,
        collection_name: c.name,
      };
      batch.update(doc(collection(firestore, 'decks'), deck.id), {
        last_edited: currentTimestamp,
        linked_collections: arrayUnion(connectionLink),
      });

      await batch.commit();
      setDeck({ ...deck, linked_collections: [...deck.linked_collections, connectionLink] });
    },
    [deck, setDeck]
  );

  return (
    <div className="collections">
      {!user || loading ? (
        <div className="text">Loading...</div>
      ) : empty ? (
        <div className="text">No collections, make one!</div>
      ) : (
        collections.map((collection) => {
          const disabled =
            selected || deck.linked_collections.find((c: ConnectionLinkSchema) => c.collection_id === collection.id);
          return (
            <div
              className={'collection-preview' + (disabled ? ' collection-disabled' : '')}
              key={collection.id}
              onClick={async () => {
                if (!disabled) {
                  await addCollectionLink(collection);
                  closeModal();
                }
              }}
            >
              <div className="name">{collection.name}</div>
            </div>
          );
        })
      )}
    </div>
  );
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
    linked_collections: [],
    name: '',
    id: '',
  });

  const [addOpen, setAddOpen] = useState<boolean>(false);

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
      const d = await getDoc(doc(collection(firestore, 'decks'), params.deckId));
      if (!d.exists()) {
        setExists(false);
      } else {
        setDeck({ ...d.data(), id: d.id } as DeckSchema);
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
          {deck.name ? (
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
              <button className="add-to-collection" onClick={() => setAddOpen(true)}>
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
      <Modal open={addOpen} onClose={() => setAddOpen(false)}>
        <CollectionModal {...{ user, deck, setDeck }} closeModal={() => setAddOpen(false)} />
      </Modal>
    </>
  );
}

export default Deck;
