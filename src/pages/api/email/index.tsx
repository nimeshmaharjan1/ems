import { OrderEmail } from '@/features/email/order';
import { prisma } from '@/shared/utils/db';
import { transporter } from '@/shared/utils/email-transporter.util';
import { render } from '@react-email/render';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { name, email, orderId } = req.body;
      const order = await prisma.order.findUnique({
        where: {
          id: orderId,
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          user: true,
        },
      });

      if (!order) {
        return res.status(404).json({
          message: 'Order not found.',
        });
      }

      const emailHtml = render(OrderEmail(order));

      const mailOptions = {
        from: 'Eeshan Mahadev 👥 <eeshanmahadev.enterprises@gmail.com>',
        to: order.user.email as string,
        // to: 'hello@mailinator.com',
        subject: 'Eeshan Mahadev Enterprises💐 | Order',
        html: emailHtml,
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          return res.status(400).json({ message: 'Error: Could not send email' });
        }

        console.log('Email sent: ' + info.response);
        return res.status(200).json({ message: 'Email has been sent.' });
      });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({
        message: 'Failed to send the email please try again later again.',
      });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `HTTP method ${req.method} is not supported.` });
  }
}
