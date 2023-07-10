import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { USER_ROLES } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';

export default async function isAuthenticated(req: NextApiRequest, res: NextApiResponse): Promise<boolean> {
  const session = await getServerSession(req, res, authOptions);
  if (session && (session.user?.role === USER_ROLES.STAFF || session.user?.role === USER_ROLES.SUPER_ADMIN)) {
    return true;
  }
  // res.status(401).json({ message: 'Unauthorized.' });
  return false;
}
