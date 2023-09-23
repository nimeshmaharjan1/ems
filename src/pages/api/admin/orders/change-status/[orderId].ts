import isAuthenticated from '@/features/admin/hof/is-authenticated';
import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const orderId = req.query.orderId as string;
  if (req.method === 'PATCH') {
    const auth = await isAuthenticated(req, res);
    if (!auth) {
      return res.status(401).json({ message: 'Unauthorized.' });
    }
    try {
      const { paymentStatus, status } = req.body;
      const order = await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus,
          status,
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          user: true,
        },
      });
      res.status(200).json({ order, message: 'Status updated successfully.' });
    } catch (e) {
      console.error(e);
      res.status(500).json({
        error: e,
        message: 'Something went wrong while trying to change the order status.',
      });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.setHeader('Allow', ['PATCH']);
    res.status(405).json({ message: `HTTP method ${req.method} is not supported.` });
  }
}
