import {getSession} from 'next-auth/react';
import { _Firebase } from '../../utils/firebase';

export default async (req, res) => {
  const session = await getSession({ req });
  const body = JSON.parse(req.body);
  if (!session) {
    return res.status(403).end();
  }
  if (!body.id) {
    return res.status(401).end();
  }
  const firebase = new _Firebase();
  console.log(body);
  firebase.updateArrayField({path: `users/${session.user.email}`, key: 'devices', value: body.id});

  res.status(200).end();
};
