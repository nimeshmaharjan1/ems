import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Order, OrderItem, SELECTED_WHOLESALE_OPTION, PAYMENT_METHOD } from '@prisma/client';
import isAuthenticated from '@/features/admin/hof/is-authenticated';

const prisma = new PrismaClient();

interface CreateOrderItem {
  productId: string;
  quantity: number;
  price: number; // Changed from string to number
}

interface CreateOrderRequest {
  items: CreateOrderItem[];
  userId: string;
  customerAddress: string;
  additionalPhoneNumber?: string;
  selectedWholesaleOption?: SELECTED_WHOLESALE_OPTION;
  paymentMethod: PAYMENT_METHOD;
}

interface CreateOrderResponse {
  message: string;
  order: Order & { items: OrderItem[] };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    await isAuthenticated(req, res);
    try {
      const { items, userId, customerAddress, additionalPhoneNumber, selectedWholesaleOption, paymentMethod }: CreateOrderRequest =
        req.body;

      // Calculate the total price by iterating over the items and multiplying the quantity with the provided price
      const totalPrice = items.reduce((sum, item) => {
        return sum + item.quantity * item.price;
      }, 0);
      let deliveryCharge: number;
      try {
        const product = await prisma.settings.findFirst();
        deliveryCharge = product?.deliveryCharge!;
      } catch (error) {
        return res.status(500).json({ error, message: 'Something went wrong while trying to get the delivery charge.' });
      }

      const vat = totalPrice + deliveryCharge + 0.13;

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
            userId,
            customerAddress,
            totalPrice: Math.round(totalPrice + deliveryCharge + vat),
            additionalPhoneNumber,
            selectedWholesaleOption,
            paymentMethod,
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

        const response: CreateOrderResponse = { message: 'Your order has been placed.', order };

        res.status(200).json(response);
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error, message: 'Something went wrong' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `HTTP method ${req.method} is not supported.` });
  }
}
