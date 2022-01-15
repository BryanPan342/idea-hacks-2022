import { getToken } from 'next-auth/jwt';
import {getSession} from 'next-auth/react';

const secret = process.env.SECRET;
let accessToken;

export default async (req, res) => {
  const session = await getSession({ req });
  const token = await getToken({ req, secret });

  accessToken = token.accessToken;

  res.status(200).json({accessToken, session});
};
