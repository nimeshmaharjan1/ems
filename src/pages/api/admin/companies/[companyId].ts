import { ReactSelectReturn } from './../../../../shared/interfaces/common.interface';
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import isAuthenticated from '@/features/admin/hof/is-authenticated';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = req.query.companyId as string;
  const authenticated = await isAuthenticated(req, res);
  if (!authenticated) {
    return;
  } else if (req.method === 'PUT') {
    try {
      const { name, products, categories } = req.body;
      const categoryIds = categories?.map((category: ReactSelectReturn) => ({ id: category.value })) ?? [];
      const company = await prisma.company.update({
        where: { id },
        data: { name, categories: { set: categoryIds }, products },
      });
      res.status(200).json({ message: 'Company successfully updated.', company });
    } catch (e) {
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
