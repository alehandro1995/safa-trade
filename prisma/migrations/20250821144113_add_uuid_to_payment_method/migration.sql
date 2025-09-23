/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `payment_method` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "bank_name" ALTER COLUMN "uuid" SET DEFAULT gen_random_uuid()::text;

-- AlterTable
ALTER TABLE "payment_method" ADD COLUMN     "uuid" TEXT NOT NULL DEFAULT gen_random_uuid()::text;

-- CreateIndex
CREATE UNIQUE INDEX "payment_method_uuid_key" ON "payment_method"("uuid");
