import isAuthenticated from '@/features/admin/hof/is-authenticated';
import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = req.query.productId as string;
  const authenticated = await isAuthenticated(req, res);
  if (!authenticated) {
    return res.status(401).json({ message: 'Unauthenticated' });
  } else if (req.method === 'GET') {
    try {
      const product = await prisma.product.findUnique({ where: { id }, include: { category: true, company: true } });
      const reactSelectCompany = {
        label: product?.company.name,
        value: product?.company.id,
      };
      const reactSelectCategory = {
        label: product?.category.name,
        value: product?.category.id,
      };
      res.status(200).json({ product: { ...product, company: reactSelectCompany, category: reactSelectCategory } });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Something went wrong while trying to fetch company.' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.status(405).json({ message: `HTTP method ${req.method} is not supported.` });
  }
}
