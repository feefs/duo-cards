import { User } from 'firebase/auth';
import { arrayUnion, collection, doc, getDocs, query, Timestamp, where, writeBatch } from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';

import { firestore } from '../../ts/firebase';
import {
  CollectionEntitySchema,
  CollectionEntityType,
  CollectionSchema,
  ConnectionLinkSchema,
  DeckSchema,
} from '../../ts/interfaces';
import './CollectionModal.scss';

interface CollectionModalProps {
  user: User | null | undefined;
  closeModal: Function;
  deck: DeckSchema;
  setDeck: Function;
}

export function CollectionModal(props: CollectionModalProps): JSX.Element {
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
