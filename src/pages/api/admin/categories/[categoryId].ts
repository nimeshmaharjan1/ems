import { ReactSelectReturn } from './../../../../shared/interfaces/common.interface';
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import isAuthenticated from '@/features/admin/hof/is-authenticated';
const prisma = new PrismaClient();
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = req.query.categoryId as string;
  const authenticated = await isAuthenticated(req, res);
  if (!authenticated) {
    return;
  } else if (req.method === 'PUT') {
    try {
      const { name, products, companies } = req.body;
      const companyIds = companies?.map((company: ReactSelectReturn) => ({ id: company.value })) ?? [];
      const category = await prisma.category.update({
        where: { id },
        data: { name, companies: { set: companyIds }, products },
      });
      res.status(200).json({ message: 'Category successfully updated.', category });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error, message: 'Something went wrong' });
    } finally {
      await prisma.$disconnect();
    }
  } else if (req.method === 'GET') {
    try {
      const category = await prisma.category.findUnique({ where: { id }, include: { companies: true } });
      const reactSelectCompanies = category?.companies.map((company) => ({ label: company.name, value: company.id }));
      res.status(200).json({ category: { ...category, companies: reactSelectCompanies } });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Something went wrong while trying to fetch company.' });
    } finally {
      await prisma.$disconnect();
    }
  } else if (req.method === 'DELETE') {
    try {
      const category = await prisma.category.findUnique({ where: { id } });
      if (!category) {
        res.status(404).json({ message: 'Category has already been deleted please try refreshing the page.' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Something went wrong while trying to delete category.' });
    }
    try {
      await prisma.category.delete({ where: { id } });
      res.status(201).json({ message: 'Category deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Something went wrong while trying to delete category.' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `HTTP method ${req.method} is not supported.` });
  }
}
