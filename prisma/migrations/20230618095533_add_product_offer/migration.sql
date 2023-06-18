-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "discountPercentage" DOUBLE PRECISION,
ADD COLUMN     "discountedPrice" DOUBLE PRECISION,
ADD COLUMN     "hasOffer" BOOLEAN DEFAULT false;
