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
  } else if (req.method === 'DELETE') {
    try {
      const order = await prisma.order.findUnique({ where: { id: orderId } });
      if (!order) {
        res.status(404).json({ message: 'Order has already been deleted please try refreshing the page.' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Something went wrong while trying to delete order.' });
    }
    try {
      await prisma.order.delete({ where: { id: orderId } });
      res.status(201).json({ message: 'Order deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Something went wrong while trying to delete order.' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.setHeader('Allow', ['PATCH']);
    res.status(405).json({ message: `HTTP method ${req.method} is not supported.` });
  }
}
