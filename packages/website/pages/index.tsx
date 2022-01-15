import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import {useSession} from 'next-auth/react';
import DeviceDropdown from '../components/DeviceDropdown';
import { _Firebase } from '../utils/firebase';
import { Firestore } from 'firebase/firestore';

export default function Home() {
  const {data: session} = useSession();
  const [firebase] = useState(new _Firebase());
  const [db, setDb] = useState<Firestore | null>(null);
  
  useEffect(() => {
    setDb(firebase.db);
  }, []);
  
  return (
    <Layout>
      <h1>Hello {session?.user?.name} 👋</h1>
      <p>{session?.user?.email}</p>
      <DeviceDropdown db={db} />
    </Layout>
  );
}
