import isAuthenticated from '@/features/admin/hof/is-authenticated';
import isSuperAdmin from '@/features/admin/hof/is-super-admin';
import { PrismaClient, USER_ROLES } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = req.query.userId as string;
  const { role } = req.body;
  if (req.method === 'PATCH') {
    if (role === USER_ROLES.SUPER_ADMIN) {
      if (!(await isSuperAdmin(req, res))) {
        return res.status(401).json({ message: 'This action needs a super admin role authority.' });
      }
    }
    const auth = await isAuthenticated(req, res);
    if (!auth) {
      return res.status(401).json({ message: 'Unauthorized.' });
    }
    try {
      const updatedUser = await prisma.user.update({
        where: { id },
        data: {
          role,
          applyingAsBusinessClient: false,
        },
      });
      res.status(200).json({ updatedUser, message: "User's role has been updated." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error, message: 'Something went wrong while trying to update the user role.' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.status(405).json({ message: `HTTP method ${req.method} is not supported.` });
  }
}
