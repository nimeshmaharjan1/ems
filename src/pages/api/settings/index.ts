import { prisma } from '@/shared/utils/db';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const settings = await prisma.settings.findFirst();
      return res.status(200).json({
        settings,
        message: 'Settings has been fetched.',
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Something went wrong while trying to fetch the settings.',
      });
    }
  } else {
    return res.status(404);
  }
}
