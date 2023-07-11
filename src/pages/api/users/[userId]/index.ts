import isAuthenticated from '@/features/admin/hof/is-authenticated';
import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = req.query.userId as string;

  const { name, email, phone_number, image } = req.body;
  if (req.method === 'PATCH') {
    try {
      const updatedUser = await prisma.user.update({
        where: { id },
        data: {
          name,
          email,
          phone_number,
          image,
        },
      });
      res.status(200).json({ updatedUser, message: 'User has been updated.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error, message: 'Something went wrong while trying to update the user.' });
    } finally {
      await prisma.$disconnect();
    }
  } else if (req.method === 'GET') {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
      });

      res.status(200).json({ user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error, message: 'Something went wrong while trying to get the user.' });
    }
  } else {
    res.status(405).json({ message: `HTTP method ${req.method} is not supported.` });
  }
}
