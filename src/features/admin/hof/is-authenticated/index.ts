import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export default async function isAuthenticated(req: NextApiRequest, res: NextApiResponse): Promise<boolean> {
  const session = await getSession({ req });
  if (session) {
    return true;
  }
  res.status(401).json({ message: 'Unauthorized.' });
  return false;
}
