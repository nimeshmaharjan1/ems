import { ReactSelectReturn } from './../../../../shared/interfaces/common.interface';
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import isAuthenticated from '@/features/admin/hof/is-authenticated';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = req.query.companyId as string;
  if (req.method === 'PUT') {
    await isAuthenticated(req, res);
    try {
      const { name, products, categories } = req.body;
      const categoryIds = categories?.map((category: ReactSelectReturn) => ({ id: category.value })) ?? [];
      const company = await prisma.company.update({
        where: { id },
        data: { name, categories: { set: categoryIds }, products },
      });
      res.status(200).json({ message: 'Company successfully updated.', company });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: 'Something went wrong' });
    } finally {
      await prisma.$disconnect();
    }
  } else if (req.method === 'GET') {
    try {
      const company = await prisma.company.findUnique({ where: { id }, include: { categories: true } });
      const reactSelectCompanies = company?.categories.map((company) => ({ label: company.name, value: company.id }));
      res.status(200).json({ company: { ...company, categories: reactSelectCompanies } });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Something went wrong while trying to fetch company.' });
    } finally {
      await prisma.$disconnect();
    }
  } else if (req.method === 'DELETE') {
    try {
      const company = await prisma.company.findUnique({ where: { id } });
      if (!company) {
        res.status(404).json({ message: 'Company has already been deleted please try refreshing the page.' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Something went wrong while trying to delete company.' });
    }
    try {
      await prisma.company.delete({ where: { id } });
      res.status(201).json({ message: 'Company deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Something went wrong while trying to delete company.' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `HTTP method ${req.method} is not supported.` });
  }
}
