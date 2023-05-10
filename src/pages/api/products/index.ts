import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
interface SearchParams {
  price_gt?: number;
  price_lt?: number;
  title?: string;
  company?: string;
  category?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { price_gt, price_lt, title, company, category } = req.query as SearchParams;

      const filters: any = {};

      if (price_gt) {
        filters.price = {
          gt: Number(price_gt),
        };
      }

      if (price_lt) {
        if (!filters.price) {
          filters.price = {};
        }
        filters.price.lt = Number(price_lt);
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

      const products = await prisma.product.findMany({
        where: filters,
        include: {
          category: true,
          company: true,
        },
      });

      res.status(200).json({ products });
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
