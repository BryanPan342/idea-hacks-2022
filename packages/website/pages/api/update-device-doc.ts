import { doc, updateDoc } from 'firebase/firestore';
import { getToken } from 'next-auth/jwt';
import {getSession} from 'next-auth/react';
import { _Firebase } from '../../utils/firebase';

const secret = process.env.SECRET;
let accessToken;

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
    read_mode: false,
  };

  const deviceDoc = doc(db, 'devices', 'mfrc522');

  void updateDoc(deviceDoc, updatedDeviceDoc);
  return res.status(200).end();
};
