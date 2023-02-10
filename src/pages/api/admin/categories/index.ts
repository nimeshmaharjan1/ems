import { ReactSelectReturn } from './../../../../shared/interfaces/common.interface';
import { ICategoryResponse } from './../../../../shared/interfaces/category.interface';
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import isAuthenticated from '@/features/admin/hof/is-authenticated';
import { string } from 'zod';
const prisma = new PrismaClient();
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const authenticated = await isAuthenticated(req, res);
  if (!authenticated) {
    return;
  }
  if (req.method === 'POST') {
    try {
      const { name, products, companies } = req.body;
      const companyIds = companies.map((company: ReactSelectReturn) => ({ id: company.value })) ?? [];
      const category = await prisma.category.create({
        data: { name, companies: { connect: companyIds }, products },
      });
      res.status(200).json({ message: 'Category successfully created.', category });
    } catch (e) {
      res.status(500).json({ error: e, message: 'Something went wrong' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { id, name, products, companies } = req.body;
      const category = await prisma.category.update({
        where: { id },
        data: { name, companies, products },
      });
      res.status(200).json({ message: 'Category successfully updated.', category });
    } catch (e) {
      res.status(500).json({ message: 'Something went wrong' });
    }
  } else if (req.method === 'GET') {
    try {
      const { page = 1, pageSize = 25 } = req.query;

      const totalRecords = (await prisma.category.count()) as number;
      const totalPages = Math.ceil(totalRecords / (pageSize as number));

      const categories = await prisma.category.findMany({
        skip: (Number(page) - 1) * (pageSize as number),
        include: {
          products: true,
          companies: true,
        },
        take: pageSize as number,
      });
      const response = {
        data: categories,
        limit: pageSize as number,
        page: Number(page),
        totalPages,
        totalRecords,
      };

      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: 'Something went wrong while trying to fetch categories.' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const id = req.query.id as string;
      await prisma.category.delete({ where: { id } });
      res.status(201).json({ message: 'Category deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Something went wrong while trying to delete category.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `HTTP method ${req.method} is not supported.` });
  }
}
