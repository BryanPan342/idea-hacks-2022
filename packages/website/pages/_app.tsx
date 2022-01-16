import { AppProps } from 'next/app';
import React, { createContext, useEffect, useState } from 'react';
import '../styles/globals.scss';
import { USER_DATA } from '../utils/storage';
import { IUserData } from '../utils/user-data';
import { _Firebase } from '../utils/firebase';
import { SessionProvider } from "next-auth/react";

export interface IAppContext {
  userData: IUserData | null,
  setUserData: (data: IUserData) => void,
  isAuthenticated: boolean;
  signOut: () => void;
  firebase: _Firebase;
  currentDevice: string | null;
  setCurrentDevice: (val: string) => void;
}

export const AppContext = createContext<IAppContext>({
  userData: null,
  setUserData: (_data) => null,
  isAuthenticated: false,
  signOut: () => null,
  firebase: null,
  currentDevice: null,
  setCurrentDevice: () => null
});

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps): JSX.Element {
  const [userData, setUserData] = useState<IUserData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [firebase] = useState(new _Firebase());
  const [currentDevice, setCurrentDevice] = useState<string | null>(null);

  useEffect(() => {
    const storage = window.localStorage;
    setUserData(JSON.parse(storage.getItem(USER_DATA)));

    const signin = async () => {
      console.log('signing in');
      setUserData('test');
    };

    void signin();
  }, []);

  useEffect(() => {
    const storage = window.localStorage;
    userData
      ? storage.setItem(USER_DATA, JSON.stringify(userData))
      : storage.removeItem(USER_DATA);

    // If user data is null then we are not authenticated
    setIsAuthenticated(!!userData);
  }, [userData]);

  const signOut = () => {
    console.log('sigining out');
    setUserData(null);

    // make doubling work here but making sure this is set to null
    setIsAuthenticated(false);
  };

  return (
    <SessionProvider session={session}>
      <AppContext.Provider value={{
        userData,
        setUserData,
        isAuthenticated,
        signOut,
        firebase,
        currentDevice,
        setCurrentDevice
      }}>
        <Component {...pageProps} />
      </AppContext.Provider>
    </SessionProvider>
  );
}

export default MyApp;
