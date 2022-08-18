import { User } from 'firebase/auth';
import { useCallback, useState } from 'react';

import { BaseModalProps, Modal } from '../Modal';
import './InputModal.scss';

type InputModalProps = BaseModalProps & {
  user: User | null | undefined;
  initialText: string;
  placeholderText: string;
  submitText: (value: string) => Promise<void>;
};

export function InputModal(props: InputModalProps): JSX.Element {
  const { open, onClose, user, initialText, placeholderText, submitText } = props;

  const [text, setText] = useState<string>(initialText);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const canSubmit = useCallback(() => {
    return user && text && !submitted;
  }, [user, text, submitted]);

  return (
    <Modal innerClassName="input-modal" {...{ open, onClose }}>
      <>
        <input className="text" value={text} placeholder={placeholderText} onChange={(e) => setText(e.target.value)} />
        <button
          className={'submit' + (canSubmit() ? '' : ' disabled')}
          onClick={async () => {
            if (canSubmit()) {
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
