import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Order, OrderItem } from '@prisma/client';
import isAuthenticated from '@/features/admin/hof/is-authenticated';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = await isAuthenticated(req, res);
  if (!auth) {
    return res.status(400).json({ message: 'Unauthorized.' });
  }
  if (req.method === 'POST') {
    const { comment, userId, orderId } = req.body;
    try {
      const newComment = await prisma.comment.create({
        data: {
          comment,
          user: { connect: { id: userId } },
          order: { connect: { id: orderId } },
        },
      });

      res.status(201).json({ message: 'Comment successfully posted.' });
    } catch (error) {
      console.error('Error creating comment:', error);
      res.status(500).json({ message: 'Failed to create comment' });
    }
  } else if (req.method === 'GET') {
    const { orderId } = req.body;
    try {
      const { page = 1 } = req.query;
      const limit = parseInt(req.query.limit as string) || 5;

      const totalRecords = ((await prisma.comment.count()) as number) ?? 0;
      const totalPages = Math.ceil(totalRecords / (limit as number));

      const comments = await prisma.comment.findMany({
        skip: (Number(page) - 1) * (limit as number) || 0,
        take: limit as number,
        include: {
          user: true,
        },
        orderBy: { createdAt: 'desc' }, // newest review first
        where: {
          orderId,
        },
      });
      const response = {
        data: comments,
        limit: limit as number,
        page: Number(page),
        totalPages,
        totalRecords,
      };

      res.status(200).json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Something went wrong while trying to fetch comments.' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
