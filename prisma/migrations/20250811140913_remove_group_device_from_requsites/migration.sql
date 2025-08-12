/*
  Warnings:

  - You are about to drop the column `deviceId` on the `requisites` table. All the data in the column will be lost.
  - You are about to drop the column `groupId` on the `requisites` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "requisites" DROP CONSTRAINT "requisites_deviceId_fkey";

-- DropForeignKey
ALTER TABLE "requisites" DROP CONSTRAINT "requisites_groupId_fkey";

-- AlterTable
ALTER TABLE "requisites" DROP COLUMN "deviceId",
DROP COLUMN "groupId";
