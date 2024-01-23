import isSuperAdmin from '@/features/admin/hof/is-super-admin';
import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = req.query.userId as string;
  if (req.method === 'DELETE') {
    const auth = await isSuperAdmin(req, res);
    if (!auth) {
      await prisma.$disconnect();
      return res.status(401).json({ message: 'This action needs a super admin role authority.' });
    }
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
      if (!user) return res.status(404).json({ message: 'User not found' });
      if (user.role === 'SUPER_ADMIN') return res.status(401).json({ message: 'You cannot delete a super admin.' });
      await prisma.user.delete({
        where: {
          id: userId,
        },
      });
      return res.status(200).json({ message: 'User has been deleted.' });
    } catch (error) {
      res.status(500).json({ message: 'Something went wrong while trying to delete the user.', error });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    await prisma.$disconnect();
    res.setHeader('Allow', ['DELETE']);
    res.status(405).json({ message: `HTTP method ${req.method} is not supported.` });
  }
}
