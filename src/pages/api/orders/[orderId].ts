import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import isAuthenticated from '@/features/admin/hof/is-authenticated';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  isAuthenticated(req, res);
  const orderId = req.query.orderId as string;
  if (req.method === 'PATCH') {
    try {
      const { hasBeenPaid } = req.body;

      const dataToUpdate: any = { hasBeenPaid };

      if (hasBeenPaid) {
        // Set the current date for paidAt
        dataToUpdate.paidAt = new Date();
      } else {
        dataToUpdate.paidAt = null;
      }

      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: dataToUpdate,
      });

      res.status(200).json({ message: 'Order successfully marked as paid.', order: updatedOrder });
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: 'Something went wrong while trying to change the paid status.' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.setHeader('Allow', ['PATCH']);
    res.status(405).json({ message: `HTTP method ${req.method} is not supported.` });
  }
}
