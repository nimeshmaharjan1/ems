-- AlterEnum
ALTER TYPE "PAYMENT_STATUS" ADD VALUE 'Partial';

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "amountLeftToPay" DOUBLE PRECISION,
ADD COLUMN     "partialyPaidAmount" DOUBLE PRECISION;
