import { PrismaClient } from '@prisma/client';
import { hash } from 'argon2';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email, username, password, role, phone_number, name, applyingAsBusinessClient, taxId, shopAddress } = req.body;
  switch (req.method) {
    case 'POST':
      const userExists = await prisma.user.findFirst({
        where: { email },
      });
      if (userExists) {
        return res.status(409).json({ message: 'User already exists' });
      }

      try {
        const hashedPassword = await hash(password);
        const user = await prisma.user.create({
          data: { username, email, password: hashedPassword, role, name, phone_number, applyingAsBusinessClient, shopAddress, taxId },
        });
        return res.status(201).json({ user, message: 'User created successfully.' });
      } catch (error: any) {
        if (error?.code === 'P2002') {
          if (error?.meta?.target[0] === 'username') res.status(400).json({ message: 'Username already exists.' });
          if (error?.meta?.target[0] === 'phone_number') {
            res.status(400).json({ message: 'Phone number already exists.' });
          }
        }
        return res.status(500).json({ error, message: 'Something went wrong while trying to create the user.' });
      } finally {
        await prisma.$disconnect();
      }
    default:
      return res.status(405).send(`HTTP method ${req.method} is not allowed.`);
  }
}
