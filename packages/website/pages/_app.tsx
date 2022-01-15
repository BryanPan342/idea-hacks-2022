import {AppProps} from 'next/app';
import React, { createContext, useEffect, useState } from 'react';
import '../styles/globals.scss';
import { USER_DATA } from '../utils/storage';
import { IUserData } from '../utils/user-data';

export interface IAppContext {
  userData: IUserData | null,
  setUserData: (data: IUserData) => void,
  isAuthenticated: boolean;
  signOut: () => void;
}

export const AppContext = createContext<IAppContext>({
  userData: null,
  setUserData: (_data) => null,
  isAuthenticated: false,
  signOut: () => null,
});

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  const [ userData, setUserData ] = useState<IUserData | null>(null);
  const [ isAuthenticated, setIsAuthenticated ] = useState(false);

  useEffect(() => {
    const storage = window.localStorage;
    setUserData(JSON.parse(storage.getItem(USER_DATA)));

    const signin = async () => {
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
    setUserData(null);

    // make doubling work here but making sure this is set to null
    setIsAuthenticated(false);
  };

  return (
    <AppContext.Provider value={{
      userData,
      setUserData,
      isAuthenticated,
      signOut,
    }}>
      <Component {...pageProps} />
    </AppContext.Provider>
  );
}

export default MyApp;
