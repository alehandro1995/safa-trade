-- CreateEnum
CREATE TYPE "user_role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'COMPLETED', 'CANCELED', 'FAILED', 'REFUNDED', 'DISPUTED');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('RECEIVE', 'PAYMENT');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "inviteToken" TEXT NOT NULL,
    "role" "user_role" NOT NULL DEFAULT 'USER',
    "status" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "payInGambling" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "payOutGambling" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "payInExchangers" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "payOutExchangers" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "paymentStatus" BOOLEAN NOT NULL DEFAULT false,
    "receiveStatus" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Device" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "deviceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Device_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Group" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "requisites" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "deviceId" INTEGER,
    "groupId" INTEGER,
    "currencyId" INTEGER NOT NULL,
    "bankId" INTEGER NOT NULL,
    "paymentId" INTEGER NOT NULL,
    "cardNumber" TEXT NOT NULL,
    "cardOwner" TEXT NOT NULL,
    "card" TEXT NOT NULL,
    "minOrder" INTEGER,
    "maxOrder" INTEGER,
    "dayLimit" INTEGER,
    "monthLimit" INTEGER,
    "dayQuantity" INTEGER,
    "monthQuantity" INTEGER,
    "concurrentOrder" INTEGER,
    "minutesDelay" INTEGER,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "requisites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "num" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "requisitesId" INTEGER NOT NULL,
    "deviceId" INTEGER,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "type" "TransactionType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentSetting" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "minOrder" INTEGER,
    "maxOrder" INTEGER,
    "currencyId" INTEGER NOT NULL,
    "paymentId" INTEGER NOT NULL,
    "bankId" INTEGER NOT NULL,

    CONSTRAINT "PaymentSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "currency" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "currency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bank_name" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bank_name_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_method" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_method_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_inviteToken_key" ON "User"("inviteToken");

-- CreateIndex
CREATE UNIQUE INDEX "Device_deviceId_key" ON "Device"("deviceId");

-- CreateIndex
CREATE UNIQUE INDEX "Invite_token_key" ON "Group"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_number_key" ON "Transaction"("num");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentSetting_userId_key" ON "PaymentSetting"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentSetting_currencyId_key" ON "PaymentSetting"("currencyId");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentSetting_paymentId_key" ON "PaymentSetting"("paymentId");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentSetting_bankId_key" ON "PaymentSetting"("bankId");

-- CreateIndex
CREATE UNIQUE INDEX "Currency_name_key" ON "currency"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Bank_name_key" ON "bank_name"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_method_name_key" ON "payment_method"("name");

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requisites" ADD CONSTRAINT "requisites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requisites" ADD CONSTRAINT "requisites_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requisites" ADD CONSTRAINT "requisites_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requisites" ADD CONSTRAINT "requisites_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES "currency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requisites" ADD CONSTRAINT "requisites_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "bank_name"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requisites" ADD CONSTRAINT "requisites_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payment_method"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_requisitesId_fkey" FOREIGN KEY ("requisitesId") REFERENCES "requisites"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentSetting" ADD CONSTRAINT "PaymentSetting_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentSetting" ADD CONSTRAINT "PaymentSetting_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES "currency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentSetting" ADD CONSTRAINT "PaymentSetting_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payment_method"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentSetting" ADD CONSTRAINT "PaymentSetting_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "bank_name"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
