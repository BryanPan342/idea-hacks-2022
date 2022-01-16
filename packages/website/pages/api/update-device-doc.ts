import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { getToken, JWT } from 'next-auth/jwt';
import {getSession} from 'next-auth/react';
import { Body } from 'node-fetch';
import { _Firebase } from '../../utils/firebase';

const secret = process.env.SECRET;
let accessToken;

interface FireStoreDeviceDoc {
  payload: {
    access_token: string,
    play_album: string,
  }
  read_mode: boolean
}

export default async (req, res) => {
  const firebase = new _Firebase();
  const db = firebase.db;

  const session = await getSession({ req });
  if (!session) {
    return res.status(403).end();
  }

  const body = JSON.parse(req.body);

  const token = await getToken({req, secret});
  accessToken = token.accessToken;

  const updatedDeviceDoc = {
    payload: {
      play_album: body.album.id,
      access_token: accessToken,
    },
    read_mode: true,
  };

  const deviceDoc = doc(db, 'devices', 'mfrc522');

  updateDoc(deviceDoc, updatedDeviceDoc);
  return res.status(200).end();
};
