/*
  Warnings:

  - The values [CASH,ESEWA,KHALTI,BANK] on the enum `PAYMENT_METHOD` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `hasBeenPaid` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `paidAt` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `totalDiscountedPrice` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `paid_through` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `discountPercentage` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `discountedPrice` on the `Product` table. All the data in the column will be lost.
  - Added the required column `customerAddress` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerAddressCity` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerEmail` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerFullName` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerPhoneNumber` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deliveryCharge` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderNumber` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ORDER_STATUS" AS ENUM ('Pending', 'Processing', 'Dispatched', 'Delivered', 'Cancelled', 'Returned');

-- CreateEnum
CREATE TYPE "PAYMENT_STATUS" AS ENUM ('Paid', 'Unpaid', 'Refunded');

-- CreateEnum
CREATE TYPE "PRODUCT_STATUS" AS ENUM ('ACTIVE', 'DRAFT');

-- AlterEnum
BEGIN;
CREATE TYPE "PAYMENT_METHOD_new" AS ENUM ('COD', 'FONEPAY');
ALTER TABLE "Order" ALTER COLUMN "paymentMethod" TYPE "PAYMENT_METHOD_new" USING ("paymentMethod"::text::"PAYMENT_METHOD_new");
ALTER TYPE "PAYMENT_METHOD" RENAME TO "PAYMENT_METHOD_old";
ALTER TYPE "PAYMENT_METHOD_new" RENAME TO "PAYMENT_METHOD";
DROP TYPE "PAYMENT_METHOD_old";
COMMIT;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "hasBeenPaid",
DROP COLUMN "paidAt",
DROP COLUMN "totalDiscountedPrice",
ADD COLUMN     "customerAddress" TEXT NOT NULL,
ADD COLUMN     "customerAddressCity" TEXT NOT NULL,
ADD COLUMN     "customerAddressLandmark" TEXT,
ADD COLUMN     "customerEmail" TEXT NOT NULL,
ADD COLUMN     "customerFullName" TEXT NOT NULL,
ADD COLUMN     "customerPhoneNumber" TEXT NOT NULL,
ADD COLUMN     "deliveryCharge" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "orderNumber" INTEGER NOT NULL,
ADD COLUMN     "paymentMethod" "PAYMENT_METHOD" NOT NULL DEFAULT 'COD',
ADD COLUMN     "paymentStatus" "PAYMENT_STATUS" NOT NULL DEFAULT 'Unpaid',
ADD COLUMN     "status" "ORDER_STATUS" NOT NULL DEFAULT 'Pending';

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "paid_through",
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "discountPercentage",
DROP COLUMN "discountedPrice",
ADD COLUMN     "crossedPrice" DOUBLE PRECISION,
ADD COLUMN     "sellingPrice" DOUBLE PRECISION,
ADD COLUMN     "status" "PRODUCT_STATUS" DEFAULT 'ACTIVE';

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
