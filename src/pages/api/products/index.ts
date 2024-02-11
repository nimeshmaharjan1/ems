import { ShopBySearchParams } from "@/store/use-shop-by";
import { PrismaClient, Review } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { RatingSummary } from "./reviews";
const prisma = new PrismaClient();
function getRatingSummary(reviews: Review[]): RatingSummary {
  const ratings: RatingSummary = {
    "1": 0,
    "2": 0,
    "3": 0,
    "4": 0,
    "5": 0,
  };

  for (const review of reviews) {
    const rating = review.rating.toString();
    ratings[rating] += 1;
  }

  return ratings;
}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const { priceGt, priceLt, title, company, category } =
        req.query as ShopBySearchParams;

      const filters: any = {};

      if (priceGt) {
        filters.sellingPrice = {
          // gt: Number(priceGt),
          gte: parseFloat(priceGt),
        };
      }

      if (priceLt) {
        if (!filters.sellingPrice) {
          filters.sellingPrice = {};
        }
        filters.sellingPrice.lte = parseFloat(priceLt);
      }

      if (title) {
        filters.title = {
          contains: title,
          mode: "insensitive",
        };
      }

      if (company) {
        filters.company = {
          name: {
            contains: company,
            mode: "insensitive",
          },
        };
      }

      if (category) {
        filters.category = {
          name: {
            contains: category,
            mode: "insensitive",
          },
        };
      }

      const { page = 1 } = req.query;
      const limit = parseInt(req.query.limit as string) || 6;
      const totalRecords = ((await prisma.product.count()) as number) ?? 0;
      const totalPages = Math.ceil(totalRecords / (limit as number));
      const products = await prisma.product.findMany({
        where: filters,
        orderBy: { createdAt: "desc" }, // newest products first
        skip: (Number(page) - 1) * (limit as number) || 0,
        take: limit as number,
        include: {
          category: true,
          company: true,
          reviews: true,
        },
      });
      const productsWithRatingSummary = products.map((product) => {
        const ratingSummary = getRatingSummary(product.reviews);
        const totalRatings =
          ratingSummary["1"] +
          ratingSummary["2"] +
          ratingSummary["3"] +
          ratingSummary["4"] +
          ratingSummary["5"];

        const averageRating = (
          (1 * ratingSummary["1"] +
            2 * ratingSummary["2"] +
            3 * ratingSummary["3"] +
            4 * ratingSummary["4"] +
            5 * ratingSummary["5"]) /
          totalRatings
        ).toFixed(0);

        const percentageRatings = {
          "5": ((ratingSummary["5"] / totalRatings) * 100).toFixed(0),
          "4": ((ratingSummary["4"] / totalRatings) * 100).toFixed(0),
          "3": ((ratingSummary["3"] / totalRatings) * 100).toFixed(0),
          "2": ((ratingSummary["2"] / totalRatings) * 100).toFixed(0),
          "1": ((ratingSummary["1"] / totalRatings) * 100).toFixed(0),
        };

        return {
          ...product,
          ratingSummary: {
            averageRating,
            percentageRatings,
          },
        };
      });

      res
        .status(200)
        .json({
          products: productsWithRatingSummary,
          limit: limit as number,
          page: Number(page),
          totalPages,
          totalRecords,
        });
    } catch (e) {
      console.error(e);
      res
        .status(500)
        .json({
          message: "Something went wrong while trying to fetch the products.",
          error: e,
        });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res
      .status(405)
      .json({ message: `HTTP method ${req.method} is not supported.` });
  }
}
