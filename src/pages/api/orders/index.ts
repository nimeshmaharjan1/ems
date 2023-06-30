import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Order, OrderItem } from '@prisma/client';
import isAuthenticated from '@/features/admin/hof/is-authenticated';

const prisma = new PrismaClient();

interface CreateOrderItem {
  productId: string;
  quantity: number;
  price: string;
  discountedPrice?: string;
  hasOffer?: boolean;
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
      const totalDiscountedPrice = items.reduce((sum, item) => {
        if (item.hasOffer) {
          return sum + parseFloat(item.discountedPrice!) * item.quantity;
        }
        return sum + parseFloat(item.price) * item.quantity;
      }, 0);

      await prisma.$connect();
      //TODO Create order needs to have customer details and stuff
      await prisma.$transaction(async (prisma) => {
        const order: Order & { items: OrderItem[] } = await prisma.order.create({
          data: {
            items: {
              create: items.map((item) => ({
                quantity: item.quantity,
                productId: item.productId,
                price: item.price,
              })),
            },
            totalPrice,
            userId,
          },
          include: {
            items: true,
          },
        });

        // Update product quantities
        for (const item of items) {
          const product = await prisma.product.findUnique({ where: { id: item.productId } });

          if (!product) {
            throw new Error(`Product with ID ${item.productId} does not exist.`);
          }

          if (Number(product.quantity) < item.quantity) {
            throw new Error(`Insufficient quantity for product with ID ${item.productId}.`);
          }

          const updatedQuantity = Number(product.quantity) - item.quantity;

          await prisma.product.update({
            where: { id: item.productId },
            data: { quantity: updatedQuantity.toString() },
          });
        }

        const response: CreateOrderResponse = { message: 'Order successfully created.', order };

        res.status(200).json(response);
      });
    } catch (error) {
      res.status(500).json({ error, message: 'Something went wrong' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `HTTP method ${req.method} is not supported.` });
  }
}
