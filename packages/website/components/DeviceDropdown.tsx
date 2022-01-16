import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { doc, onSnapshot } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../pages/_app';

import font from '../styles/_variables.module.scss';
import styles from '../styles/DeviceDropdown.module.scss';
import { _Firebase } from '../utils/firebase';
import Modal from './StyledModel';

interface FirestoreUser {
  name: string
  devices: string[]
  refresh_token?: string
}

export default function DeviceDropdown() {
  const { firebase } = useContext(AppContext);

  const [open, setOpen] = useState(false);

  const { data: session } = useSession();
  const [userData, setUserData] = useState<FirestoreUser | null>(null);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [textInput, setTextInput] = useState('');

  useEffect(() => {
    if (!session?.user || !firebase.db) return;

    onSnapshot(doc(firebase.db, 'users', session.user?.email), (doc) => {
      const data = doc.data() as FirestoreUser;
      setUserData({ ...data });
    });

    const main = async () => {
      const data = await firebase.get({path: `users/${session.user?.email}`});
      if (data === null) return;
      setUserData({ ...data });
    };

    main();
  }, [firebase, session]);

  if (!session) return null;

  const onDeviceSelect = (e) => setSelectedDevice(e.target.value);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const submit = () => {
    window.fetch('/api/add-device', {
      method: 'POST',
      body: JSON.stringify({id: textInput}),
    });
    setTextInput('');
    handleClose();
  };

  return (
    <>
      <FormControl
        sx={{
          'm': 1,
          'minWidth': '120px',
          '& .MuiOutlinedInput-root': {
            height: '32px',
            font: font['button-text'],
          },
          '& .MuiSelect-select': {
            minHeight: '0px !important',
          },
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
      <Modal open={open} setOpen={setOpen}>
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
      </Modal>
    </>
  );
}
