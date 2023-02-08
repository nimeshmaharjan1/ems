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
      const category = await prisma.category.create({
        data: { name },
      });
      res.status(200).json({ message: 'Category successfully created.', category });
    } catch (e) {
      res.status(500).json({ message: 'Something went wrong' });
    }
  } else if (req.method === 'GET') {
    try {
      const categories = await prisma.category.findMany({
        include: {
          companies: true,
          products: true,
          _count: true,
        },
      });
      res.status(201).json({ categories });
    } catch (error) {
      res.status(500).json({ message: 'Something went wrong while trying to fetch categories.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `HTTP method ${req.method} is not supported.` });
  }
}
