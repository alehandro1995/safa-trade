/*
  Warnings:

  - You are about to drop the column `balanceAfter` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `balanceBefore` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "balanceAfter",
DROP COLUMN "balanceBefore",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
