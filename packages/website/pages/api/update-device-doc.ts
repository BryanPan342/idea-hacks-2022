import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { getToken, JWT } from 'next-auth/jwt';
import {getSession} from 'next-auth/react';
import { _Firebase } from '../../utils/firebase';

const secret = process.env.SECRET;
let accessToken;

interface FireStoreDeviceDoc {
  payload: {
    read_mode: boolean
    access_token: JWT
    play_album: string
  }
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

  const updatedDeviceDoc: FireStoreDeviceDoc = {
    payload: {
      read_mode: false,
      play_album: body.album.id,
      access_token: accessToken
    }
  }

  const deviceDoc = doc(db, 'devices', 'mfrc522');

  updateDoc(deviceDoc, updatedDeviceDoc)
    .then(() => {
      return res.status(200).end();
    })
    .catch(() => {
      return res.status(400).end();
    })
};
