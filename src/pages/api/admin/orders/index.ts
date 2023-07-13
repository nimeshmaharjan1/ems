import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Order, OrderItem, USER_ROLES } from '@prisma/client';
import isAuthenticated from '@/features/admin/hof/is-authenticated';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    await isAuthenticated(req, res);
    try {
      const { page = 1, customer_type = 'b2b' } = req.query;
      const limit = parseInt(req.query.limit as string) || 6;
      const totalRecords = ((await prisma.product.count()) as number) ?? 0;
      const totalPages = Math.ceil(totalRecords / (limit as number));
      const orders = await prisma.order.findMany({
        where: {
          user: {
            role: customer_type === 'b2b' ? USER_ROLES.BUSINESS_CLIENT : USER_ROLES.USER || USER_ROLES.SUPER_ADMIN || USER_ROLES.STAFF,
          },
        },
        orderBy: { createdAt: 'desc' }, // newest orders first
        skip: (Number(page) - 1) * (limit as number) || 0,
        take: limit as number,
        include: {
          user: {
            select: {
              name: true,
              phone_number: true,
              email: true,
            },
          },
          items: {
            include: {
              product: true,
            },
          },
        },
      });
      res.status(200).json({ orders, limit: limit as number, page: Number(page), totalPages, totalRecords });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: 'Something went wrong while trying to fetch the orders.', error: e });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ message: `HTTP method ${req.method} is not supported.` });
  }
}
