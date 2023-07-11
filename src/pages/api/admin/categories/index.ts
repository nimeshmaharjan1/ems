import isAuthenticated from '@/features/admin/hof/is-authenticated';
import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { ReactSelectReturn } from './../../../../shared/interfaces/common.interface';
const prisma = new PrismaClient();
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const auth = await isAuthenticated(req, res);
    if (!auth) return res.status(401).json({ message: 'Unauthorized.' });
    try {
      const { name, products, companies } = req.body;
      const companyIds = companies?.map((company: ReactSelectReturn) => ({ id: company.value })) ?? [];
      const category = await prisma.category.create({
        data: { name, companies: { connect: companyIds }, products },
      });
      res.status(200).json({ message: 'Category successfully created.', category });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e, message: 'Something went wrong' });
    } finally {
      await prisma.$disconnect();
    }
  } else if (req.method === 'GET') {
    try {
      const { page = 1 } = req.query;
      const limit = parseInt(req.query.limit as string) || 5;

      const totalRecords = (await prisma.category.count()) as number;
      const totalPages = Math.ceil(totalRecords / (limit as number));

      const categories = await prisma.category.findMany({
        skip: (Number(page) - 1) * (limit as number) || 0,
        include: {
          products: true,
          companies: true,
        },
        take: limit as number,
      });
      const response = {
        data: categories,
        limit: limit as number,
        page: Number(page),
        totalPages,
        totalRecords,
      };
      res.status(200).json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error, message: 'Something went wrong while trying to fetch categories.' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.status(405).json({ message: `HTTP method ${req.method} is not supported.` });
  }
}
