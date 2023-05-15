import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { ShopBySearchParams } from '@/store/use-shop-by';
const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { priceGt, priceLt, title, company, category } = req.query as ShopBySearchParams;

      const filters: any = {};

      if (priceGt) {
        filters.price = {
          // gt: Number(priceGt),
          gte: parseFloat(priceGt),
        };
      }

      if (priceLt) {
        if (!filters.price) {
          filters.price = {};
        }
        filters.price.lte = parseFloat(priceLt);
      }

      if (title) {
        filters.title = {
          contains: title,
          mode: 'insensitive',
        };
      }

      if (company) {
        filters.company = {
          name: {
            contains: company,
            mode: 'insensitive',
          },
        };
      }

      if (category) {
        filters.category = {
          name: {
            contains: category,
            mode: 'insensitive',
          },
        };
      }

      const { page = 1 } = req.query;
      const limit = parseInt(req.query.limit as string) || 6;
      const totalRecords = ((await prisma.product.count()) as number) ?? 0;
      const totalPages = Math.ceil(totalRecords / (limit as number));
      const products = await prisma.product.findMany({
        where: filters,
        orderBy: { createdAt: 'desc' }, // newest products first
        skip: (Number(page) - 1) * (limit as number) || 0,
        take: limit as number,
        include: {
          category: true,
          company: true,
        },
      });
      res.status(200).json({ products, limit: limit as number, page: Number(page), totalPages, totalRecords });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: 'Something went wrong while trying to fetch the products.' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `HTTP method ${req.method} is not supported.` });
  }
}
