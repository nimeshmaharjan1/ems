/*
  Warnings:

  - You are about to drop the column `customerAddressCity` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `customerAddressLandmark` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `customerEmail` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `customerFullName` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `customerPhoneNumber` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "customerAddressCity",
DROP COLUMN "customerAddressLandmark",
DROP COLUMN "customerEmail",
DROP COLUMN "customerFullName",
DROP COLUMN "customerPhoneNumber";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "address",
ADD COLUMN     "shopAddress" TEXT,
ADD COLUMN     "taxId" TEXT;
