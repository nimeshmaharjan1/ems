import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import isAuthenticated from '@/features/admin/hof/is-authenticated';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const auth = await isAuthenticated(req, res);
    if (!auth) return res.status(401).json({ message: 'Unauthorized.' });
    try {
      const { page = 1 } = req.query;
      const limit = parseInt(req.query.limit as string) || 10;

      const totalRecords = ((await prisma.complaint.count()) as number) ?? 0;
      const totalPages = Math.ceil(totalRecords / (limit as number));

      const complaints = await prisma.complaint.findMany({
        // orderBy: {
        //   position: { sort: 'asc' },
        // },
        skip: (Number(page) - 1) * (limit as number) || 0,
        include: {
          comments: true,
          faultyItems: {
            include: {
              orderItem: {
                include: {
                  product: true,
                },
              },
            },
          },
          user: true,
          order: true,
        },
        take: limit as number,
      });
      const response = {
        complaints,
        limit: limit as number,
        page: Number(page),
        totalPages,
        totalRecords,
      };

      res.status(200).json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Something went wrong while trying to fetch complaints.' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `HTTP method ${req.method} is not supported.` });
  }
}
