/*
  Warnings:

  - You are about to drop the column `selectedWholesaleOption` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "selectedWholesaleOption" "SELECTED_WHOLESALE_OPTION" DEFAULT 'CASH';

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "selectedWholesaleOption";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "address" TEXT;
