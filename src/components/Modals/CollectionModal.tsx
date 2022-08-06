import { User } from 'firebase/auth';
import { addDoc, collection, doc, getDocs, query, Timestamp, updateDoc, where } from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';

import { firestore } from '../../ts/firebase';
import { ChildKind, CollectionSchema, DeckSchema } from '../../ts/interfaces';
import './CollectionModal.scss';

interface CollectionModalProps {
  user: User | null | undefined;
  closeModal: Function;
  deck: DeckSchema;
  setDeck: (value: React.SetStateAction<DeckSchema>) => void;
}

export function CollectionModal(props: CollectionModalProps): JSX.Element {
  const { user, closeModal, deck, setDeck } = props;

  const [loading, setLoading] = useState<boolean>(true);
  const [empty, setEmpty] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(false);
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
      if (!user) {
        return;
      }
      setDisabled(true);
      await addDoc(collection(firestore, 'links'), {
        child_id: deck.id,
        child_kind: ChildKind.Deck,
        child_name: deck.name,
        created: Timestamp.now(),
        parent_name: c.name,
        parent_id: c.id,

        creator_uid: user.uid,
      });
      await updateDoc(doc(firestore, 'decks', deck.id), { linked: true });
      // TODO see if removing breaks things
      setDeck({ ...deck, parent: { id: c.id, name: c.name } });
    },
    [user, deck, setDeck]
  );

  return (
    <div className="collections">
      {!user || loading ? (
        <div className="text">Loading...</div>
      ) : deck.parent ? (
        <div className="text">This deck is already part of the collection {deck.parent.name}!</div>
      ) : empty ? (
        <div className="text">No collections, make one!</div>
      ) : (
        collections.map((collection) => (
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
        ))
      )}
    </div>
  );
}
