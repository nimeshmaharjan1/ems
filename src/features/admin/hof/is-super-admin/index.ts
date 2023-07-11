import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { USER_ROLES } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';

export default async function isSuperAdmin(req: NextApiRequest, res: NextApiResponse): Promise<boolean> {
  const session = await getServerSession(req, res, authOptions);
  if (session && session.user?.role === USER_ROLES.SUPER_ADMIN) {
    return true;
  }
  return false;
}
