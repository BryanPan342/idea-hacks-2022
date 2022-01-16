import { useSession, signOut } from 'next-auth/react';
import React from 'react';

import styles from '../styles/Navbar.module.scss';
import DeviceDropdown from './DeviceDropdown';
import Link from './Link';

function LogOut(): JSX.Element {
  const logout = () => {
    signOut();
  };
  return (
    <button onClick={logout}>
      log out
    </button>
  );
}

export default function Navbar(): JSX.Element {
  const {data: session} = useSession();
  return (
    <div id={styles.navbar}>
      <div id={styles['logo-container']}>
        <DeviceDropdown />
      </div>
      <div id={styles['links-container']}>
        {session && <LogOut />}
      </div>
    </div>
  );
}
