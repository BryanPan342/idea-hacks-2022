import ModalUnstyled from '@mui/base/ModalUnstyled';
import { styled } from '@mui/system';
import React, { Dispatch, SetStateAction } from 'react';

const StyledModal = styled(ModalUnstyled)`
  position: fixed;
  z-index: 1300;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  max-width: 75vw;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Backdrop = styled('div')`
  z-index: -1;
  position: fixed;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  -webkit-tap-highlight-color: transparent;
`;

interface ModalProps {
  children: JSX.Element
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

export default function Modal({ children, open, setOpen }: ModalProps) {
  const handleClose = () => setOpen(false);

  return (
    <StyledModal
      aria-labelledby="unstyled-modal-title"
      aria-describedby="unstyled-modal-description"
      open={open}
      onClose={handleClose}
      BackdropComponent={Backdrop}
    >
      {children}
    </StyledModal>
  );
}
