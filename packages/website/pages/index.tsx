import React, { useContext, useEffect, useState } from 'react';
import Layout from '../components/Layout';
import {useSession} from 'next-auth/react';

import Grid from '@mui/material/Grid';

import styles from '../styles/Home.module.scss';
import Modalstyles from '../styles/DeviceDropdown.module.scss';
import Modal from '../components/StyledModel';
import { AppContext } from './_app';

interface Album {
  readonly id: string;
  readonly title: string;
  readonly productUrl: string;
  readonly mediaItemsCount: number;
  readonly coverPhotoBaseUrl: string;
  readonly coverPhotoMediaItemId: string;
}

export default function Home() {
  const {currentDevice} = useContext(AppContext);
  const {data: session} = useSession();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [modalContent, setModalContent] = useState<JSX.Element>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchAlbums = async () => {
    const res = await window.fetch('/api/list-albums');
    if (!res.ok) { return; }
    const data = await res.json();
    setAlbums(data.albums);
  }

  useEffect(() => {
    if (session) {
      void fetchAlbums();
    }
  }, [session]);

  const onAlbumClick = async (album: Album) => {
    // if there is no device selected, prompt the user to select the device
    if (!currentDevice)
    {
      setModalContent(
        <div id={Modalstyles.modal}>
          <h2 id="unstyled-modal-title">No Device Selected</h2>
          <p id="unstyled-modal-description">
            Please select a device that you would like to see 
            this album displayed on and then continue!
          </p>
        </div>
      );
      setModalOpen(true);
      return;
    }

    // show the popup modal for instructions to tap the tile to the device
    setModalContent(
      <div id={Modalstyles.modal}>
        <h2 id="unstyled-modal-title">Pair this album with a tile!</h2>
        <p id="unstyled-modal-description">
          Tap the tile that you would like to pair this album with!
        </p>
      </div>
    )
    setModalOpen(true);
    
    const res = await window.fetch('/api/update-device-doc', {
      method: 'POST',
      body: JSON.stringify({
        album: album
      })
    });
    if (!res.ok) { return; }
  }

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
        <Modal open={modalOpen} setOpen={setModalOpen}>
          {modalContent}
        </Modal>
      </div>
    </Layout>
  );
}
