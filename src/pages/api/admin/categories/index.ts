import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import isAuthenticated from '@/features/admin/hof/is-authenticated';
const prisma = new PrismaClient();
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const authenticated = await isAuthenticated(req, res);
  if (!authenticated) {
    return;
  }
  if (req.method === 'POST') {
    try {
      const { name } = req.body;
      const product = await prisma.category.create({
        data: { name },
      });
      res.status(200).json({ message: 'Category successfully created.', product });
    } catch (e) {
      res.status(500).json({ message: 'Something went wrong' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `HTTP method ${req.method} is not supported.` });
  }
}
