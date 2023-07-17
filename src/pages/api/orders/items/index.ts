import { ReactSelectReturn } from './../../../../shared/interfaces/common.interface';
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import isAuthenticated from '@/features/admin/hof/is-authenticated';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { page = 1, orderNumber } = req.query;
      const limit = parseInt(req.query.limit as string) || 5;

      const totalRecords =
        ((await prisma.order.count({
          where: {
            orderNumber: parseInt(orderNumber as string),
          },
        })) as number) ?? 0;
      const totalPages = Math.ceil(totalRecords / (limit as number));

      const orderItems = await prisma.order.findMany({
        skip: (Number(page) - 1) * (limit as number) || 0,
        where: {
          orderNumber: parseInt(orderNumber as string),
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
        take: limit as number,
      });
      const response = {
        data: orderItems,
        limit: limit as number,
        page: Number(page),
        totalPages,
        totalRecords,
      };

      res.status(200).json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Something went wrong while trying to fetch the order items.' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.status(405).json({ message: `HTTP method ${req.method} is not supported.` });
  }
}
