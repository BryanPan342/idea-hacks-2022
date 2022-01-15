import { useEffect, useState } from "react";
import { doc, Firestore, onSnapshot } from "firebase/firestore";
import { _Firebase } from '../utils/firebase';
import Dropdown from 'react-dropdown';

interface FirestoreUser {
  name: string
  devices: string[]
  refresh_token?: string
}

interface DeviceDropdownProps {
  db: Firestore
}

export default function DeviceDropdown(props: DeviceDropdownProps) {
  const db = props.db;
  const [userData, setUserData] = useState<FirestoreUser | null>(null);
  const [selectedDevice, setSelectedDevice] = useState(null);

  useEffect(() => {
    if (db)
      onSnapshot(doc(db, "users", "bryanSucks"), (doc) => {
        console.log("Current data: ", doc.data());
        setUserData({
          name: doc.data().name,
          devices: doc.data().devices,
        });
      });
  }, [db])

  const onDeviceSelect = (e) => setSelectedDevice(e.value);

  return (
    <>
      <Dropdown 
        options={userData?.devices} onChange={onDeviceSelect} value={selectedDevice} placeholder="Select an option" 
        className="root"
        controlClassName="control"
        placeholderClassName="placeholder"
        menuClassName="menu"
        arrowClassName="arrow"
        arrowOpen={<span className="open" />} />
      <p>{userData?.name}</p>
    </>
  )
}