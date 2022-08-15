import { User } from 'firebase/auth';
import { addDoc, collection, doc, getDocs, query, Timestamp, updateDoc, where } from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';

import { Deck, Parent } from '../../../data/types';
import { firestore } from '../../../ts/firebase';
import { ChildKind, CollectionSchema } from '../../../ts/interfaces';
import { BaseModalProps, Modal } from '../Modal';
import './CollectionModal.scss';

type CollectionModalProps = BaseModalProps & {
  user: User | null | undefined;
  deck: Deck;
  deckId: string | undefined;
  parent: (Parent | null) | undefined;
  updateUI: () => void;
};

export function CollectionModal(props: CollectionModalProps): JSX.Element {
  const { open, onClose, user, deck, deckId, parent, updateUI } = props;

  const [loading, setLoading] = useState<boolean>(true);
  const [empty, setEmpty] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [collections, setCollections] = useState<CollectionSchema[]>([]);

  useEffect(() => {
    async function fetchCollections() {
      if (!user || deckId === undefined) {
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
  }, [user, deckId]);

  const addCollectionLink = useCallback(
    async (c: CollectionSchema) => {
      if (!user || deckId === undefined) {
        return;
      }
      setDisabled(true);
      await addDoc(collection(firestore, 'links'), {
        child_id: deckId,
        child_kind: ChildKind.Deck,
        child_name: deck.name,
        created: Timestamp.now(),
        parent_name: c.name,
        parent_id: c.id,

        creator_uid: user.uid,
      });
      await updateDoc(doc(firestore, 'decks', deckId), { linked: true });
    },
    [user, deckId, deck]
  );

  return (
    <Modal innerClassName="collection-modal" {...{ open, onClose }}>
      <div className="collections">
        {!user || loading ? (
          <div className="text">Loading...</div>
        ) : parent ? (
          <div className="text">This deck is already part of the collection {parent.name}!</div>
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
                  updateUI();
                }
              }}
            >
              <div className="name">{collection.name}</div>
            </div>
          ))
        )}
      </div>
    </Modal>
  );
}
