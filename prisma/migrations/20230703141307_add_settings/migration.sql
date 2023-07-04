-- AlterTable
ALTER TABLE "Settings" ADD COLUMN     "contactNumber" TEXT,
ADD COLUMN     "facebook" TEXT,
ADD COLUMN     "storeAddress" TEXT,
ADD COLUMN     "tiktok" TEXT,
ALTER COLUMN "deliveryCharge" SET DEFAULT 250;
