import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import {useSession} from 'next-auth/react';
import { doc, Firestore, onSnapshot } from "firebase/firestore";
import { _Firebase } from '../utils/firebase';

interface FirestoreUser {
  name: string
  devices: string[]
  refresh_token?: string
}

export default function Home() {
  const {data: session} = useSession();
  const [firebase] = useState(new _Firebase());
  const [db, setDb] = useState<Firestore | null>(null);
  const [data, setData] = useState<FirestoreUser | null>(null);

  useEffect(() => {
    setDb(firebase.db);
  }, []);

  useEffect(() => {
    if (db)
      onSnapshot(doc(db, "users", "bryanSucks"), (doc) => {
        console.log("Current data: ", doc.data());
        setData({
          name: doc.data().name,
          devices: doc.data().devices,
        });
      });
  }, [db])

  return (
    <Layout>
      <h1>Hello {session?.user?.name} 👋</h1>
      <p>{session?.user?.email}</p>
      <p>{data?.name}</p>
    </Layout>
  );
}
