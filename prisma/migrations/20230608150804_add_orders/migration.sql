-- CreateEnum
CREATE TYPE "PAYMENT_METHOD" AS ENUM ('CASH', 'ESEWA', 'KHALTI', 'BANK');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "hasBeenPaid" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "paidAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "paidThrough" "PAYMENT_METHOD";
