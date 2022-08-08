import { Modal as MaterialModal, ModalProps } from '@mui/material';
import { styled } from '@mui/system';

const StyledModal = styled(MaterialModal)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}) as typeof MaterialModal;

export function Modal(props: ModalProps & { innerClassName: string }) {
  const { innerClassName, ...modalProps } = props;
  return (
    <StyledModal {...modalProps}>
      <div className={innerClassName}>{props.children}</div>
    </StyledModal>
  );
}

export interface BaseModalProps {
  open: boolean;
  onClose: () => void;
}
