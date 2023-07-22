import isAuthenticated from '@/features/admin/hof/is-authenticated';
import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = await isAuthenticated(req, res);
  if (!auth) return res.status(401).json({ message: 'Unauthorized.' });

  const prisma = new PrismaClient();
  try {
    const orders = await prisma.order.findMany({
      where: {
        paymentStatus: 'Paid',
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const revenueData = orders.map((order) => ({
      date: order.createdAt, // Corrected here
      revenue: order.totalPrice,
    }));

    res.status(200).json({ revenueData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to calculate revenue' });
  } finally {
    await prisma.$disconnect();
  }
}
