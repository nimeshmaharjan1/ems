import isAuthenticated from '@/features/admin/hof/is-authenticated';
import isSuperAdmin from '@/features/admin/hof/is-super-admin';
import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = req.query.userId as string;
  await isSuperAdmin(req, res);
  const { role } = req.body;
  if (req.method === 'PATCH') {
    try {
      const updatedUser = await prisma.user.update({
        where: { id },
        data: {
          role,
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
