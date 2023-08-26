import { PrismaClient, USER_ROLES } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const session = await getServerSession(req, res, authOptions);
    if (session?.user?.role !== USER_ROLES.BUSINESS_CLIENT) {
      return res.status(401).json({ message: "Unauthorized." });
    }
    try {
      const { page = 1, user_id, order_status } = req.query;
      const limit = parseInt(req.query.limit as string) || 6;
      const totalRecords =
        ((await prisma.order.count({
          where: {
            user: {
              id: user_id as string,
            },
          },
        })) as number) ?? 0;
      const totalPages = Math.ceil(totalRecords / (limit as number));
      let ordersQuery = {
        orderBy: { createdAt: "desc" }, // newest orders first
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
          items: {
            include: {
              product: true,
            },
          },
        },
      } as any;

      if (order_status) {
        ordersQuery = {
          ...ordersQuery,
          where: {
            user: {
              id: user_id,
            },
            status: order_status,
          },
        };
      } else {
        ordersQuery = {
          ...ordersQuery,
          where: {
            user: {
              id: user_id,
            },
          },
        };
      }

      const orders = await prisma.order.findMany(ordersQuery);
      res.status(200).json({
        orders,
        limit: limit as number,
        page: Number(page),
        totalPages,
        totalRecords,
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({
        message: "Something went wrong while trying to fetch the orders.",
        error: e,
      });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    await prisma.$disconnect();
    res.setHeader("Allow", ["GET"]);
    res
      .status(405)
      .json({ message: `HTTP method ${req.method} is not supported.` });
  }
}
