import { ReactSelectReturn } from './../../../../shared/interfaces/common.interface';
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import isAuthenticated from '@/features/admin/hof/is-authenticated';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const authenticated = await isAuthenticated(req, res);
  if (!authenticated) {
    return;
  }
  if (req.method === 'POST') {
    try {
      const { name, products, categories } = req.body;
      const categoryIds = categories?.map((category: ReactSelectReturn) => ({ id: category.value })) ?? [];
      const company = await prisma.company.create({
        data: { name, categories: { connect: categoryIds }, products },
      });
      res.status(200).json({ message: 'Company successfully created.', company });
    } catch (e) {
      console.log(e);

      res.status(500).json({ error: e, message: 'Something went wrong' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { id, name, products, categories } = req.body;
      const company = await prisma.company.update({
        where: { id },
        data: { name, categories, products },
      });
      res.status(200).json({ message: 'Company successfully updated.', company });
    } catch (e) {
      res.status(500).json({ message: 'Something went wrong' });
    }
  } else if (req.method === 'GET') {
    try {
      const { page = 1 } = req.query;
      const limit = parseInt(req.query.limit as string) || 5;

      const totalRecords = (await prisma.company.count()) as number;
      const totalPages = Math.ceil(totalRecords / (limit as number));

      const companies = await prisma.company.findMany({
        skip: (Number(page) - 1) * (limit as number) || 0,
        include: {
          products: true,
          categories: true,
        },
        take: limit as number,
      });
      const response = {
        data: companies,
        limit: limit as number,
        page: Number(page),
        totalPages,
        totalRecords,
      };

      res.status(200).json(response);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Something went wrong while trying to fetch companies.' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const id = req.query.id as string;
      await prisma.company.delete({ where: { id } });
      res.status(201).json({ message: 'Company deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Something went wrong while trying to delete company.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `HTTP method ${req.method} is not supported.` });
  }
}
