import isAuthenticated from '@/features/admin/hof/is-authenticated';
import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = await isAuthenticated(req, res);
  if (!auth) return res.status(401).json({ message: 'Unauthorized.' });

  const prisma = new PrismaClient();
  try {
    const products = await prisma.product.findMany({
      include: {
        orderItems: {
          include: {
            order: true,
          },
          where: {
            order: {
              paymentStatus: 'Paid',
            },
          },
        },
      },
    });

    // Calculate the sold count, sold quantity, and sold value for each product
    const topSellingProducts = products.map((product) => {
      const soldCount = product.orderItems.reduce((acc, orderItem) => {
        // Increment the count only if the associated order is paid
        if (orderItem.order?.paymentStatus === 'Paid') {
          return acc + 1;
        }
        return acc;
      }, 0);

      const soldQuantity = product.orderItems.reduce((acc, orderItem) => {
        // Add the quantity sold only if the associated order is paid
        if (orderItem.order?.paymentStatus === 'Paid') {
          return acc + orderItem.quantity;
        }
        return acc;
      }, 0);

      const soldValue = product.orderItems.reduce((acc, orderItem) => {
        // Add the value sold only if the associated order is paid
        if (orderItem.order?.paymentStatus === 'Paid') {
          return acc + orderItem.quantity * orderItem.price;
        }
        return acc;
      }, 0);

      // Remove unnecessary data from the response and add the calculated fields
      return {
        ...product,
        soldCount,
        soldQuantity,
        soldValue,
        orderItems: undefined,
      };
    });

    // Sort products based on the sales count in descending order
    topSellingProducts.sort((a, b) => b.soldCount - a.soldCount);

    // Get the top 5 selling products (you can adjust this number as needed)
    const top5SellingProducts = topSellingProducts.slice(0, 5);

    res.status(200).json(top5SellingProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to determine the top-selling products.' });
  } finally {
    await prisma.$disconnect();
  }
}
