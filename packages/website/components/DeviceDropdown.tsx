import { useContext, useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { _Firebase } from '../utils/firebase';
import { AppContext } from "../pages/_app";

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import styles from '../styles/_variables.module.scss';

interface FirestoreUser {
  name: string
  devices: string[]
  refresh_token?: string
}


export default function DeviceDropdown() {
  const {firebase} = useContext(AppContext);
  const [userData, setUserData] = useState<FirestoreUser | null>(null);
  const [selectedDevice, setSelectedDevice] = useState(null);

  useEffect(() => {
    const db = firebase.db;
    if (db)
      onSnapshot(doc(db, "users", "bryanSucks"), (doc) => {
        const data = doc.data() as FirestoreUser;
        console.log("Current data: ", data);
        setUserData({ ...data });
      });
  }, [firebase.db])

  const onDeviceSelect = (e) => setSelectedDevice(e.target.value);
  return (
    <FormControl
      sx={{
        m: 1,
        minWidth: '120px',
        '& .MuiOutlinedInput-root': {
          height: '32px',
          font: styles['button-text'],
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
          return <MenuItem sx={{font: styles['button-text'] }} value={device}>{device}</MenuItem>;
        })}
      </Select>
    </FormControl>
  );
}
