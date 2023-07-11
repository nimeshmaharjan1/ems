/*
  Warnings:

  - You are about to drop the column `partialyPaidAmount` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "partialyPaidAmount",
ADD COLUMN     "partialPaymentTime" TIMESTAMP(3),
ADD COLUMN     "partiallyPaidAmount" DOUBLE PRECISION;
