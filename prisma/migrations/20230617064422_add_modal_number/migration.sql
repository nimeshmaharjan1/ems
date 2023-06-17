/*
  Warnings:

  - The values [ADMIN] on the enum `USER_ROLES` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "USER_ROLES_new" AS ENUM ('SUPER_ADMIN', 'STAFF', 'USER', 'BUSINESS_CLIENT');
ALTER TABLE "User" ALTER COLUMN "role" TYPE "USER_ROLES_new" USING ("role"::text::"USER_ROLES_new");
ALTER TYPE "USER_ROLES" RENAME TO "USER_ROLES_old";
ALTER TYPE "USER_ROLES_new" RENAME TO "USER_ROLES";
DROP TYPE "USER_ROLES_old";
COMMIT;

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "modalNumber" TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'USER';
