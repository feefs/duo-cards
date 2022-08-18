import { useState } from 'react';

import { InputModal } from '../Input/InputModal';
import { BaseModalProps, Modal } from '../Modal';
import './NewModal.scss';

interface NewModalProps extends BaseModalProps {
  newDeck: () => void;
  newCollection: (collectionName: string) => Promise<void>;
}

export function NewModal(props: NewModalProps): JSX.Element {
  const { open, onClose, newDeck, newCollection } = props;

  const [subcollectionOpen, setSubcollectionOpen] = useState<boolean>(false);

  return (
    <Modal innerClassName="new-modal" {...{ open, onClose }}>
      <>
        <div className="new-container">
          <button className="deck-button" onClick={() => newDeck()}>
            New deck
          </button>
          <button className="collection-button" onClick={() => setSubcollectionOpen(true)}>
            New collection
          </button>
        </div>
        <InputModal
          {...{
            open: subcollectionOpen,
            onClose: () => setSubcollectionOpen(false),
            initialText: '',
            placeholderText: 'Collection name',
            submitText: async (collectionName) => await newCollection(collectionName),
          }}
        />
      </>
    </Modal>
  );
}
