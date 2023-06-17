/*
  Warnings:

  - You are about to drop the column `modalNumber` on the `OrderItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "modalNumber",
ADD COLUMN     "modal" TEXT;
