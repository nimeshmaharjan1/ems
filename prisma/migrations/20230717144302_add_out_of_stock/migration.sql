-- AlterEnum
ALTER TYPE "PRODUCT_STATUS" ADD VALUE 'OUT_OF_STOCK';

-- AlterTable
ALTER TABLE "Company" ALTER COLUMN "position" DROP NOT NULL;
