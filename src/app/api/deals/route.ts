import { NextResponse } from "next/server";
import { prisma } from "@/client";
import { cookies } from "next/headers";
import { TransactionStatus, TransactionType } from "../../../../generated/prisma";

export async function GET(request: Request) {
  const cookie = await cookies();
	const email = cookie.get("email")?.value;

  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const status = url.searchParams.get("status") as TransactionStatus;
  const type = url.searchParams.get("type") as TransactionType;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 403 });

	// Получаем дату 12 часов назад
	const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);

	const transactions = await prisma.transaction.findMany({
		where: {
			userId: user.id,
			status: status,
			type: type,
			createdAt: {
				gte: twelveHoursAgo,
			},
		},
		select: {
			id: true,
			num: true,
			amount: true,
			status: true,
			createdAt: true,
			requisites: {
				select: {
					card: true,
					cardOwner: true,
					currency: {
						select: {
							symbol: true,
						},
					},
					paymentMethod: {
						select: {
							name: true,
						},
					},
					bankName: {
						select: {
							name: true,
						},
					},
				},
			},
			transactionHistory: {
				select: {
					id: true,
					rate: true,
					amountInCurrency: true,
					amountInCurrencyFee: true,
					transactionStatus: true,
					createdAt: true,
					initiator: true,
				},
				orderBy: {
					createdAt: "desc",
				},
			},
		},
		orderBy: {
			num: "desc",
		},
	});

  return NextResponse.json({ transactions });
}