import isAuthenticated from '@/features/admin/hof/is-authenticated';
import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = await isAuthenticated(req, res);
  if (!auth) return res.status(401).json({ message: 'Unauthorized.' });

  const prisma = new PrismaClient();
  try {
    const orders = await prisma.order.findMany({
      where: {
        paymentStatus: 'Paid',
      },
    });

    // Calculate the total revenue, number of paid orders, and total number of orders
    let totalRevenue = 0;
    let numberOfPaidOrders = 0;

    orders.forEach((order) => {
      if (order.totalPrice && order.totalPrice > 0) {
        totalRevenue += order.totalPrice;
        numberOfPaidOrders++;
      }
    });

    // Get the total number of orders (including unpaid ones)
    const totalNumberOfOrders = orders.length;

    // Calculate the average order value
    const averageOrderValue = numberOfPaidOrders > 0 ? totalRevenue / numberOfPaidOrders : 0;

    // Round down the average order value to remove the decimal
    const roundedAverageOrderValue = Math.floor(averageOrderValue);

    res.status(200).json({ averageOrderValue: roundedAverageOrderValue, numberOfOrders: totalNumberOfOrders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to calculate average order value and number of orders.' });
  } finally {
    await prisma.$disconnect();
  }
}
