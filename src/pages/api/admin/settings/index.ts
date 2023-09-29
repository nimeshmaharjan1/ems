import isAuthenticated from '@/features/admin/hof/is-authenticated';
import isSuperAdmin from '@/features/admin/hof/is-super-admin';
import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = await isAuthenticated(req, res);
  if (!auth) {
    return res.status(401).json({ message: 'Unauthorized.' });
  }
  if (req.method === 'GET') {
    try {
      const settings = await prisma.settings.findFirst();
      res.status(200).json({ settings });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error,
        message: 'Something went wrong while trying to get the settings.',
      });
    } finally {
      await prisma.$disconnect();
    }
  } else if (req.method === 'PUT') {
    try {
      const settings = await prisma.settings.findFirst();
      if (!settings) {
        return res.status(404).json({
          message: 'Settings not found please check the database incase someone deleted it.',
        });
      }
      const { contactNumber, deliveryCharge, facebook, storeAddress, tiktok, email } = req.body;
      await prisma.settings.update({
        where: {
          id: settings.id,
        },
        data: {
          contactNumber,
          deliveryCharge,
          facebook,
          storeAddress,
          tiktok,
          email,
        },
      });
      res.status(200).json({ message: 'Settings has been updated successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error,
        message: 'Something went wrong while trying to update the settings.',
      });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.status(405).json({ message: `HTTP method ${req.method} is not supported.` });
  }
}
