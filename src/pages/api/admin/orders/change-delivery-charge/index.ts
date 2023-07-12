import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import isAuthenticated from '@/features/admin/hof/is-authenticated';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PATCH') {
    await isAuthenticated(req, res);
    const { deliveryCharge, orderId } = req.body;

    try {
      const order = await prisma.order.findUnique({
        where: { id: orderId as string },
      });

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      const totalPrice = order.totalPrice - (order?.deliveryCharge ? order.deliveryCharge : 0) + deliveryCharge;

      const updatedOrder = await prisma.order.update({
        where: { id: orderId as string },
        data: {
          deliveryCharge,
          totalPrice,
          amountLeftToPay: totalPrice - (order?.partiallyPaidAmount ? order.partiallyPaidAmount : 0),
        },
      });

      res.status(200).json({ message: 'Delivery charge updated successfully', order: updatedOrder });
    } catch (error) {
      console.error('Error updating delivery charge:', error);
      res.status(500).json({ message: 'Failed to update delivery charge.' });
    }
  } else {
    res.setHeader('Allow', ['PATCH']);
    res.status(405).json({ message: `HTTP method ${req.method} is not supported.` });
  }
}
