import React from 'react';

import styles from '../styles/Navbar.module.scss';
import Link from './Link';
import { useSession, signOut } from "next-auth/react";

function LogOut(): JSX.Element {
  const logout = () => {
    signOut();
  }
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
        <Link href='/'>Home</Link>
      </div>
      <div id={styles['links-container']}>
        {session && <LogOut />}
      </div>
    </div>
  );
}
