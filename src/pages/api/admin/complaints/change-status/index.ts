import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Order, OrderItem, COMPLAINT_STATUS } from '@prisma/client';
import isAuthenticated from '@/features/admin/hof/is-authenticated';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = await isAuthenticated(req, res);
  if (!auth) {
    return res.status(400).json({ message: 'Unauthorized.' });
  }
  if (req.method === 'PATCH') {
    const { complaintId, status, userId } = req.body;
    try {
      if (status === COMPLAINT_STATUS.Resolved) {
        await prisma.complaint.update({
          where: { id: complaintId },
          data: {
            status,
            resolvedBy: {
              connect: {
                id: userId,
              },
            },
          },
        });
      } else {
        await prisma.complaint.update({
          where: { id: complaintId },
          data: {
            status,
          },
        });
      }
      res.status(201).json({ message: 'Complaint status has been updated.' });
    } catch (error) {
      console.error('Error updating complaint status:', error);
      res.status(500).json({ message: 'Failed to update complaint status.' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
