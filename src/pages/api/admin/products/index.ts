import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { images, title, description, price, category, company, quantity, slug, modal } = req.body;
      const categoryId = category?.value;
      const companyId = company?.value;
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
        },
      });
      res.status(200).json({ message: 'Product successfully created.', product });
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: 'Something went wrong' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `HTTP method ${req.method} is not supported.` });
  }
}
