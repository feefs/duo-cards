import { Modal as MaterialModal, ModalProps } from '@mui/material';
import { styled } from '@mui/system';

const StyledModal = styled(MaterialModal)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}) as typeof Modal;

export function Modal(props: ModalProps) {
  return (
    <StyledModal {...props}>
      <div className="modal">{props.children}</div>
    </StyledModal>
  );
}
