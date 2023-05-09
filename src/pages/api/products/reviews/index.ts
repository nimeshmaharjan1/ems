import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import isAuthenticated from '@/features/admin/hof/is-authenticated';
const prisma = new PrismaClient();
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const authenticated = await isAuthenticated(req, res);
  if (!authenticated) {
    return res.status(401).json({ message: 'Unauthenticated' });
  }
  if (req.method === 'POST') {
    const { rating, comment, productId, userId } = req.body;

    try {
      const review = await prisma.review.create({
        data: {
          rating,
          comment,
          productId,
          userId,
        },
      });
      res.status(201).json({ message: 'Your review has been added.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to create review.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `HTTP method ${req.method} is not supported.` });
  }
}
