/*
  Warnings:

  - You are about to drop the column `deliveryCharge` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "deliveryCharge",
ADD COLUMN     "additionalPhoneNumber" TEXT;

-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL,
    "deliveryCharge" DOUBLE PRECISION,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);
