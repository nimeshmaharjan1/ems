import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Order, OrderItem } from '@prisma/client';
import isAuthenticated from '@/features/admin/hof/is-authenticated';

const prisma = new PrismaClient();

interface CreateOrderItem {
  productId: string;
  quantity: number;
  price: string;
}

interface CreateOrderRequest {
  items: CreateOrderItem[];
  userId: string;
}

interface CreateOrderResponse {
  message: string;
  order: Order & { items: OrderItem[] };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    await isAuthenticated(req, res);
    try {
      const { items, userId }: CreateOrderRequest = req.body;

      // Calculate the total price by iterating over the items and multiplying the quantity with the provided price
      const totalPrice = items.reduce((sum, item) => {
        const itemPrice = parseFloat(item.price);
        return sum + item.quantity * itemPrice;
      }, 0);

      const order: Order & { items: OrderItem[] } = await prisma.order.create({
        data: {
          items: {
            create: items.map((item) => ({
              quantity: item.quantity,
              productId: item.productId,
            })),
          },
          totalPrice,
          userId,
        },
        include: {
          items: true,
        },
      });

      const response: CreateOrderResponse = { message: 'Order successfully created.', order };

      res.status(200).json(response);
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: 'Something went wrong' });
    } finally {
      await prisma.$disconnect();
    }
  } else if (req.method === 'GET') {
    try {
      const { page = 1 } = req.query;
      const limit = parseInt(req.query.limit as string) || 6;
      const totalRecords = ((await prisma.product.count()) as number) ?? 0;
      const totalPages = Math.ceil(totalRecords / (limit as number));
      const orders = await prisma.order.findMany({
        orderBy: { createdAt: 'desc' }, // newest orders first
        skip: (Number(page) - 1) * (limit as number) || 0,
        take: limit as number,
        include: {
          user: {
            select: {
              name: true,
              phone_number: true,
              email: true,
            },
          },
          items: true,
        },
      });
      res.status(200).json({ orders, limit: limit as number, page: Number(page), totalPages, totalRecords });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: 'Something went wrong while trying to fetch the orders.', error: e });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `HTTP method ${req.method} is not supported.` });
  }
}
