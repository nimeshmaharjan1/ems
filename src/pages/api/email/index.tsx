import { OrderEmail } from '@/features/email/order';
import { PrismaClient } from '@prisma/client';
import { render } from '@react-email/render';
import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

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
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });
      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: order.user.email as string,
        subject: 'Eeshan Mahadev Enterprises💐 | Order Confirmation',
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
