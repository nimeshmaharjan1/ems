import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { description, userId, orderId, faultyItems } = req.body;

      // Check if the associated User exists
      const userExists = await prisma.user.findUnique({ where: { id: userId } });
      if (!userExists) {
        return res.status(404).json({ message: 'Associated User not found.' });
      }

      // Check if the associated Order exists
      const orderExists = await prisma.order.findUnique({ where: { id: orderId } });
      if (!orderExists) {
        return res.status(404).json({ message: 'Associated Order not found.' });
      }

      // Create the Complaint
      const complaint = await prisma.complaint.create({
        data: {
          description,
          user: { connect: { id: userId } },
          order: { connect: { id: orderId } },
          faultyItems: {
            create: faultyItems.map((faultyItem: { orderItemId: string }) => ({
              orderItem: { connect: { id: faultyItem.orderItemId } },
            })),
          },
        },
        include: {
          faultyItems: true,
        },
      });

      res.status(201).json({ message: 'Your issue has been successfully submitted.', complaint });
    } catch (error) {
      console.error('Error creating complaint:', error);
      res.status(500).json({ message: 'Failed to submit the issue please try again later again.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `HTTP method ${req.method} is not supported.` });
  }
}
