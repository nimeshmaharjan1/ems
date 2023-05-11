import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Review } from '@prisma/client';
import isAuthenticated from '@/features/admin/hof/is-authenticated';
import { getSession } from 'next-auth/react';

type RatingSummary = {
  [key: string]: number;
};

const prisma = new PrismaClient();

function getRatingSummary(reviews: Review[]): RatingSummary {
  const ratings: RatingSummary = {
    '1': 0,
    '2': 0,
    '3': 0,
    '4': 0,
    '5': 0,
  };

  for (const review of reviews) {
    const rating = review.rating.toString();
    ratings[rating] += 1;
  }

  return ratings;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    await isAuthenticated(req, res);
    const session = await getSession({ req });

    const userId = session?.user?.id as string;
    const { rating, comment, productId } = req.body;
    try {
      await prisma.review.create({
        data: {
          rating,
          comment,
          productId,
          userId,
        },
      });
      res.status(201).json({ message: 'Your review has been added.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to create review.' });
    } finally {
      await prisma.$disconnect();
    }
  } else if (req.method === 'GET') {
    try {
      const { page = 1, productId } = req.query;
      const limit = parseInt(req.query.limit as string) || 5;

      const totalRecords = ((await prisma.review.count({ where: { productId: productId as string } })) as number) ?? 0;
      const totalPages = Math.ceil(totalRecords / (limit as number));

      const reviews = await prisma.review.findMany({
        where: { productId: productId as string },
        orderBy: { createdAt: 'desc' }, // newest review first
        skip: (Number(page) - 1) * (limit as number) || 0,
        take: limit as number,
        include: {
          user: {
            select: {
              email: true,
              username: true,
              image: true,
            },
          },
        },
      });
      const allReviews = await prisma.review.findMany({
        where: { productId: productId as string },
      });
      const ratingSummary = getRatingSummary(allReviews);

      const totalRatings = ratingSummary['1'] + ratingSummary['2'] + ratingSummary['3'] + ratingSummary['4'] + ratingSummary['5'];

      const averageRating = (
        (1 * ratingSummary['1'] + 2 * ratingSummary['2'] + 3 * ratingSummary['3'] + 4 * ratingSummary['4'] + 5 * ratingSummary['5']) /
        totalRatings
      ).toFixed(0);

      const percentageRatings = {
        '5': ((ratingSummary['5'] / totalRatings) * 100).toFixed(0),
        '4': ((ratingSummary['4'] / totalRatings) * 100).toFixed(0),
        '3': ((ratingSummary['3'] / totalRatings) * 100).toFixed(0),
        '2': ((ratingSummary['2'] / totalRatings) * 100).toFixed(0),
        '1': ((ratingSummary['1'] / totalRatings) * 100).toFixed(0),
      };

      const response = {
        data: {
          reviews,
          ratingSummary: {
            averageRating,
            percentageRatings,
          },
        },
        limit: limit as number,
        page: Number(page),
        totalPages,
        totalRecords,
      };

      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: 'Something went wrong while trying to get the reviews.' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `HTTP method ${req.method} is not supported.` });
  }
}
