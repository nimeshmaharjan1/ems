import { OrderEmail } from '@/features/email/order';
import { WelcomeEmail } from '@/features/email/register';
import { transporter } from '@/shared/utils/email-transporter.util';
import { PrismaClient, User } from '@prisma/client';
import { render } from '@react-email/render';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { user } = req.body as {
        user: User;
      };

      const emailHtml = render(
        WelcomeEmail({
          userFirstname: user.name,
        })
      );

      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: user.email as string,
        subject: 'Welcome to Eeshan Mahadev Enterprises💐',
        html: emailHtml,
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          return res.status(400).json({ message: 'Error: Could not send email' });
        }
        console.log('here: ', info.response);
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
