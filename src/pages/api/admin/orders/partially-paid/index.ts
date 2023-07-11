import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import isAuthenticated from '@/features/admin/hof/is-authenticated';
import isSuperAdmin from '@/features/admin/hof/is-super-admin';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const orderId = req.query.orderId as string;
  if (req.method === 'PATCH') {
    const auth = await isAuthenticated(req, res);
    if (!auth) {
      return res.status(401).json({ message: 'Unauthorized.' });
    }
    try {
      const { orderId, partiallyPaidAmount } = req.body;
      const order = await prisma.order.findUnique({
        where: { id: orderId },
      });
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      if (partiallyPaidAmount <= 0 || partiallyPaidAmount > order.totalPrice) {
        return res.status(400).json({ message: 'Invalid partially paid amount.', isInputError: true });
      }
      const updatedPartiallyPaidAmount = (order?.partiallyPaidAmount || 0) + partiallyPaidAmount;
      const amountLeftToPay = order.totalPrice - updatedPartiallyPaidAmount;

      await prisma.order.update({
        where: { id: orderId },
        data: {
          partiallyPaidAmount: updatedPartiallyPaidAmount,
          amountLeftToPay,
          partialPaymentTime: new Date(),
          paymentStatus: updatedPartiallyPaidAmount === order.totalPrice ? 'Paid' : 'Partial',
        },
      });
      res.status(200).json({ message: 'Partial payment updated successfully.' });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e, message: 'Something went wrong while trying to change the order status.' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.setHeader('Allow', ['PATCH']);
    res.status(405).json({ message: `HTTP method ${req.method} is not supported.` });
  }
}
