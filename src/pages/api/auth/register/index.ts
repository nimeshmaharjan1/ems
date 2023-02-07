import { PrismaClient } from '@prisma/client';
import { hash } from 'argon2';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email, username, password, role, phone_number, name } = req.body;
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
          data: { username, email, password: hashedPassword, role, name, phone_number },
        });
        return res.status(201).json({ user, message: 'User created successfully.' });
      } catch (error) {
        return res.status(500).json({ error, message: 'Something went wrong while trying to create the user.' });
      }
    default:
      return res.status(405).send(`HTTP method ${req.method} is not allowed.`);
  }
}
