import { USER_ROLES } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export default async function isSuperAdmin(req: NextApiRequest, res: NextApiResponse): Promise<boolean> {
  const session = await getSession({ req });
  if (session && session.user?.role === USER_ROLES.SUPER_ADMIN) {
    return true;
  }
  res.status(401).json({ message: 'This action needs a super admin role authority.' });
  return false;
}
