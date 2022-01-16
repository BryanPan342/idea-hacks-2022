import { getToken } from 'next-auth/jwt';
import {getSession} from 'next-auth/react';
import fetch from 'node-fetch';

const secret = process.env.SECRET;
let accessToken;

export default async (req, res) => {
  const session = await getSession({ req });
  if (!session) {
    return res.status(403).end();
  }

  const token = await getToken({req, secret});
  accessToken = token.accessToken;

  let nextPageToken: string | undefined = undefined;
  const albums = [];

  do {
    const albumRes = await fetch(
      `https://photoslibrary.googleapis.com/v1/albums?${nextPageToken ? ('pageToken=' + nextPageToken + '&') : ''}pageSize=50`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

    const data = await albumRes.json();
    data.albums?.forEach((album) => {
      albums.push(album);
    });

    nextPageToken = data.nextPageToken;
  } while (nextPageToken);

  res.status(200).json({albums: albums});
};
