import { useQuery } from '@tanstack/react-query';
import { User } from 'firebase/auth';
import { useState } from 'react';

import { linkDeckVariables } from '../../../data/mutations/deck';
import { fetchAllCollections } from '../../../data/queries';
import { Deck, Parent } from '../../../data/types';
import { BaseModalProps, Modal } from '../Modal';
import './CollectionModal.scss';

interface CollectionModalProps extends BaseModalProps {
  user: User | null | undefined;
  deck: Deck;
  deckId: string | undefined;
  parent: (Parent | null) | undefined;
  addCollectionLink: (variables: linkDeckVariables) => Promise<void>;
}

export function CollectionModal(props: CollectionModalProps): JSX.Element {
  const { open, onClose, user, deck, deckId, parent, addCollectionLink } = props;

  const [disabled, setDisabled] = useState<boolean>(false);

  const {
    isLoading,
    isError,
    data: collections,
  } = useQuery(['collections-modal'], () => fetchAllCollections(user?.uid!), {
    enabled: !!user,
  });

  return (
    <Modal innerClassName="collection-modal" {...{ open, onClose }}>
      <div className="collections">
        {isLoading ? (
          <div className="text">Loading...</div>
        ) : isError ? (
          <div className="text">Error fetching collections!</div>
        ) : parent ? (
          <div className="text">This deck is already part of the collection {parent.name}!</div>
        ) : collections.length === 0 ? (
          <div className="text">No collections, make one!</div>
        ) : (
          collections.map(({ data: collection, id }) => (
            <div
              className={'collection-preview' + (disabled ? ' collection-disabled' : '')}
              key={id}
              onClick={async () => {
                if (!disabled && user && deckId) {
                  setDisabled(true);
                  await addCollectionLink({
                    userId: user.uid,
                    collectionName: collection.name,
                    collectionId: id,
                    deckName: deck.name,
                    deckId: deckId,
                  });
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
