import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Order, OrderItem } from '@prisma/client';

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
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `HTTP method ${req.method} is not supported.` });
  }
}
