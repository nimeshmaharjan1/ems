import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { name } = req.body;
      const product = await prisma.company.create({
        data: { name },
      });
      res.status(200).json({ message: 'Company successfully created.', product });
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: 'Something went wrong' });
    }
  } else if (req.method === 'GET') {
    try {
      const companies = await prisma.company.findMany({
        include: {
          products: true,
          categories: true,
          _count: true,
        },
      });
      res.status(201).json({ companies });
    } catch (error) {
      res.status(500).json({ message: 'Something went wrong while trying to fetch companies.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `HTTP method ${req.method} is not supported.` });
  }
}
