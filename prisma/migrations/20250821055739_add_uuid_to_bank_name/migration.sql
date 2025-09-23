/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `bank_name` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "bank_name" ADD COLUMN     "uuid" TEXT NOT NULL DEFAULT gen_random_uuid()::text;

-- CreateIndex
CREATE UNIQUE INDEX "bank_name_uuid_key" ON "bank_name"("uuid");
