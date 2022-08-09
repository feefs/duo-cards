import { useState } from 'react';

import { BaseModalProps, Modal } from '../Modal';
import './ConfirmModal.scss';

type ConfirmModalProps = BaseModalProps & {
  text: string;
  confirmAction: () => Promise<void>;
};

export function ConfirmModal(props: ConfirmModalProps): JSX.Element {
  const { open, onClose, text, confirmAction } = props;

  const [confirmed, setConfirmed] = useState<boolean>(false);

  return (
    <Modal innerClassName="confirm-modal" {...{ open, onClose }}>
      <div className="confirm-container">
        <div className="text">{text}</div>
        <button
          className="confirm"
          onClick={async () => {
            if (!confirmed) {
              setConfirmed(true);
              await confirmAction();
              onClose();
            }
          }}
        >
          →
        </button>
      </div>
    </Modal>
  );
}
