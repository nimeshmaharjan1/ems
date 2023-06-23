import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { images, title, description, price, category, company, quantity, slug, modal, hasOffer, discountPercentage } = req.body;
      parseFloat(price);
      parseFloat(discountPercentage);
      const categoryId = category?.value;
      const companyId = company?.value;
      let discountedPrice: number | null = null;

      if (hasOffer) {
        discountedPrice = price - price * (discountPercentage / 100);
      } else {
        discountedPrice = null;
      }

      const product = await prisma.product.create({
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
          discountPercentage: parseFloat(discountPercentage),
        },
      });
      res.status(200).json({ message: 'Product successfully created.', product });
    } catch (e) {
      console.error(e);
      res.status(500).json({ e, message: 'Something went wrong' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `HTTP method ${req.method} is not supported.` });
  }
}
