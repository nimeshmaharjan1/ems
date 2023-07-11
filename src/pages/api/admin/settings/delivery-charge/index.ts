import isAuthenticated from '@/features/admin/hof/is-authenticated';
import isSuperAdmin from '@/features/admin/hof/is-super-admin';
import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { deliveryCharge } = req.body;
  if (req.method === 'PATCH') {
    const auth = await isAuthenticated(req, res);
    if (!auth) {
      return res.status(401).json({ message: 'Unauthorized.' });
    }
    try {
      const settings = await prisma.settings.findFirst();
      const updatedSettings = await prisma.settings.update({
        where: { id: settings?.id },
        data: {
          deliveryCharge,
        },
      });
      res.status(200).json({ updatedSettings, message: 'Delivery charge has been updated.' });
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
