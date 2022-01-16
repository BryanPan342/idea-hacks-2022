import { signIn } from 'next-auth/react';
import React from 'react';
import {useRouter} from 'next/router';
import styles from '../styles/SignIn.module.scss';

export default function SignIn(): JSX.Element {
  const router = useRouter();
  const login = () => {
    void signIn('google', {
      callbackUrl: router.asPath,
    });
  };
  return (
    <div id={styles['signin-container']}>
      <button onClick={login}>
        Sign in with Google
      </button>
    </div>
  );
}
