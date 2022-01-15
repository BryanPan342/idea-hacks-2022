import React from 'react';
import { signIn } from "next-auth/react";
import styles from '../styles/SignIn.module.scss';

export default function SignIn(): JSX.Element {
  const login = () => {
    signIn("google", {
      callbackUrl: "http://localhost:3000/"
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
