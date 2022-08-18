import { useState } from 'react';

import { BaseModalProps, Modal } from '../Modal';
import './InputModal.scss';

interface InputModalProps extends BaseModalProps {
  initialText: string;
  placeholderText: string;
  submitText: (value: string) => Promise<void>;
}

export function InputModal(props: InputModalProps): JSX.Element {
  const { open, onClose, initialText, placeholderText, submitText } = props;

  const [text, setText] = useState<string>(initialText);
  const [submitted, setSubmitted] = useState<boolean>(false);

  return (
    <Modal innerClassName="input-modal" {...{ open, onClose }}>
      <>
        <input className="text" value={text} placeholder={placeholderText} onChange={(e) => setText(e.target.value)} />
        <button
          className={'submit' + (text && !submitted ? '' : ' disabled')}
          onClick={async () => {
            if (text && !submitted) {
              setSubmitted(true);
              await submitText(text);
            }
          }}
        >
          ✓
        </button>
      </>
    </Modal>
  );
}
