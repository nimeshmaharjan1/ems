import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PUT') {
    const { companyId, newPosition } = req.body;

    try {
      const updatedCompany = await updateCompanyPosition(companyId, newPosition);
      res.status(200).json(updatedCompany);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to update company position' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `HTTP method ${req.method} is not supported.` });
  }
}

const updateCompanyPosition = async (companyId: string, newPosition: number): Promise<void> => {
  const company = await prisma.company.findUnique({ where: { id: companyId } });

  if (!company) {
    return console.error(`Company with ID ${companyId} not found.`);
  }

  //TODO remove optional position
  const { position: nullPosition } = company;
  const position = nullPosition!;
  if (newPosition === position) {
    // No change in the position, do nothing
    return;
  }

  if (newPosition < 1) {
    return console.error('position must be a positive integer.');
  }

  const existingCompanyWithSerialNumber = await prisma.company.findFirst({
    where: { position: newPosition },
  });

  if (existingCompanyWithSerialNumber) {
    // There is already a company with the new position,
    // so we need to update the serial numbers of affected companies

    const companiesToUpdate =
      newPosition < position
        ? await prisma.company.findMany({
            where: {
              AND: [{ position: { gte: newPosition } }, { position: { lt: position } }],
            },
          })
        : await prisma.company.findMany({
            where: {
              AND: [{ position: { gt: position } }, { position: { lte: newPosition } }],
            },
          });

    await Promise.all(
      companiesToUpdate.map(async (companyToUpdate) => {
        const updatedPosition =
          companyToUpdate.id === companyId ? newPosition : companyToUpdate.position! + (newPosition < position ? 1 : -1);

        await prisma.company.update({
          where: { id: companyToUpdate.id },
          data: { position: updatedPosition },
        });
      })
    );
  }

  await prisma.company.update({
    where: { id: companyId },
    data: { position: newPosition },
  });
};
