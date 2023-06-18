import { ReactSelectReturn } from './../../../../shared/interfaces/common.interface';
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import isAuthenticated from '@/features/admin/hof/is-authenticated';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = req.query.productId as string;
  await isAuthenticated(req, res);
  if (req.method === 'DELETE') {
    try {
      const product = await prisma.product.findUnique({ where: { id } });
      if (!product) {
        res.status(404).json({ message: 'Product has already been deleted please try refreshing the page.' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Something went wrong while trying to delete product.' });
    }
    try {
      const product = await prisma.product.delete({ where: { id } });
      res.status(201).json({ product, message: 'Product deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Something went wrong while trying to delete product.' });
    } finally {
      await prisma.$disconnect();
    }
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
  } else if (req.method === 'PUT') {
    try {
      const { images, title, description, price, category, company, quantity, slug, modal, hasOffer, discountPercentage } = req.body;
      const categoryId = category?.value;
      const companyId = company?.value;
      let discountedPrice: number | null = null;
      if (hasOffer) {
        discountedPrice = price - price * (discountPercentage / 100);
      } else {
        discountedPrice = null;
      }
      const product = await prisma.product.update({
        where: { id },
        data: {
          images,
          title,
          description,
          price: parseFloat(price),
          categoryId,
          companyId,
          quantity,
          slug,
          modal,
          hasOffer,
          discountedPrice,
          discountPercentage,
        },
      });
      res.status(200).json({ message: 'Product successfully created.', product });
    } catch (e) {
      res.status(500).json({ message: 'Something went wrong' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.status(405).json({ message: `HTTP method ${req.method} is not supported.` });
  }
}
