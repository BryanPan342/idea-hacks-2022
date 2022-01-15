import React from 'react';
import Layout from '../components/Layout';
import {useSession} from 'next-auth/react';

export default function Home() {
  const {data: session} = useSession();
  return (
    <Layout>
      <h1>Hello {session?.user?.name} 👋</h1>
      <p>{session?.user?.email}</p>
    </Layout>
  );
}
