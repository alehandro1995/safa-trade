/*
  Warnings:

  - You are about to drop the column `description` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `deviceId` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `balanceAfter` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `balanceBefore` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TransactionInitiator" AS ENUM ('TREADER', 'ADMIN', 'MERCHANT', 'SYSTEM');

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_deviceId_fkey";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "description",
DROP COLUMN "deviceId",
ADD COLUMN     "balanceAfter" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "balanceBefore" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "fundsBlocked" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "TransactionHistory" (
    "id" SERIAL NOT NULL,
    "transactionId" INTEGER NOT NULL,
    "transactionStatus" "TransactionStatus" NOT NULL,
    "initiator" "TransactionInitiator" NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "amountInCurrency" DOUBLE PRECISION NOT NULL,
    "amountInCurrencyFee" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,

    CONSTRAINT "TransactionHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TransactionHistory" ADD CONSTRAINT "TransactionHistory_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
