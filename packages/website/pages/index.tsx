import Grid from '@mui/material/Grid';
import {useSession} from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';


import styles from '../styles/Home.module.scss';

interface Album {
  readonly id: string;
  readonly title: string;
  readonly productUrl: string;
  readonly mediaItemsCount: number;
  readonly coverPhotoBaseUrl: string;
  readonly coverPhotoMediaItemId: string;
}

export default function Home() {
  const {data: session} = useSession();
  const [albums, setAlbums] = useState<Album[]>([]);

  const fetchAlbums = async () => {
    const res = await window.fetch('/api/list-albums');
    if (!res.ok) { return; }
    const data = await res.json();
    setAlbums(data.albums);
  };

  useEffect(() => {
    if (session) {
      void fetchAlbums();
    }
  }, [session]);

  useEffect(() => {
    console.log(albums);
  }, [albums]);

  const onAlbumClick = async (album: Album) => {
    // if there is no device selected, prompt the user to select the device

    // show the popup modal for instructions to tap the tile to the device

    const res = await window.fetch('/api/update-device-doc', {
      method: 'POST',
      body: JSON.stringify({
        album: album,
      }),
    });
    if (!res.ok) { return; }

    // Set state to remove the pop up
  };

  return (
    <Layout>
      <div id={styles['home-container']}>
        <h2>Hello {session?.user?.name} 👋</h2>
        <div id={styles['albums-container']}>
          <h3>Albums</h3>
          <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
            {albums.map((album: Album, index) => {
              return (
                <Grid item xs={2} sm={4} md={4} key={index}>
                  <div style={{padding: '16px', backgroundColor: 'white', cursor: 'pointer'}} onClick={() => onAlbumClick(album)}>
                    <img src={album.coverPhotoBaseUrl} style={{ width: '100%', height: 'auto'}}/>
                    <h4>{album.title}</h4>
                  </div>
                </Grid>
              );
            })}
          </Grid>
        </div>
      </div>
    </Layout>
  );
}
