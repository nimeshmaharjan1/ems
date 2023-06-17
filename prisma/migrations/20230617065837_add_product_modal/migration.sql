/*
  Warnings:

  - You are about to drop the column `modal` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `paidThrough` on the `OrderItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "modal",
DROP COLUMN "paidThrough",
ADD COLUMN     "paid_through" "PAYMENT_METHOD";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "modal" TEXT;
