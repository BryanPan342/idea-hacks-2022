import { useContext, useEffect, useState } from "react";
import { useSession } from 'next-auth/react';
import { doc, onSnapshot } from "firebase/firestore";
import { _Firebase } from '../utils/firebase';
import { AppContext } from "../pages/_app";

import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { styled, Box } from '@mui/system';
import ModalUnstyled from '@mui/base/ModalUnstyled';
import Select from '@mui/material/Select';

import font from '../styles/_variables.module.scss';
import styles from '../styles/DeviceDropdown.module.scss';

interface FirestoreUser {
  name: string
  devices: string[]
  refresh_token?: string
}

const StyledModal = styled(ModalUnstyled)`
  position: fixed;
  z-index: 1300;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
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

export default function DeviceDropdown() {
  const { firebase } = useContext(AppContext);

  const [open, setOpen] = useState(false);

  const { data: session } = useSession();
  const [userData, setUserData] = useState<FirestoreUser | null>(null);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [textInput, setTextInput] = useState('');

  useEffect(() => {
    if (!session?.user) return;
    onSnapshot(doc(firebase.db, "users", session.user?.email), (doc) => {
      const data = doc.data() as FirestoreUser;
      setUserData({ ...data });
    });
  }, []);

  if (!session) return null;

  const onDeviceSelect = (e) => setSelectedDevice(e.target.value);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const submit = () => {
    window.fetch('/api/add-device', {
      method: 'POST',
      body: JSON.stringify({id: textInput}),
    })
    setTextInput('');
    handleClose();
  };

  return (
    <>
      <FormControl
        sx={{
          m: 1,
          minWidth: '120px',
          '& .MuiOutlinedInput-root': {
            height: '32px',
            font: font['button-text'],
          },
          '& .MuiSelect-select': {
            minHeight: '0px !important',
          }
        }}>
        <Select
          value={selectedDevice}
          onChange={onDeviceSelect}
          displayEmpty
        >
          {(userData?.devices ?? []).map((device) => {
            return <MenuItem sx={{ font: font['button-text'] }} value={device} key={device}>{device}</MenuItem>;
          })}
          <MenuItem onClick={handleOpen} value={'➕ Add device'}>
            ➕ Add device
          </MenuItem>
        </Select>
      </FormControl>
      <StyledModal
        aria-labelledby="unstyled-modal-title"
        aria-describedby="unstyled-modal-description"
        open={open}
        onClose={handleClose}
        BackdropComponent={Backdrop}
      >
        <div id={styles.modal}>
          <h2 id="unstyled-modal-title">Add Device</h2>
          <p id="unstyled-modal-description">Add a device to this account</p>
          <div id={styles.input}>
            <input onChange={(e) => setTextInput(e.target.value)} placeholder={'Type device id here'} value={textInput} />
          </div>
          <div id={styles['button-container']}>
            <button onClick={submit}>
              Submit
            </button>
          </div>
        </div>
      </StyledModal>
    </>
  );
}
