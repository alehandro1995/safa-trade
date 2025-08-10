"use server";
import {prisma} from "@/client";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";;
import { ITransaction, TransactionFilter } from "@/types/Transaction";
import { StatisticPeriod, StatisticTransaction } from "@/types/Statistic";
import { HistoryTransaction } from "@/types/History";

export async function completeTransaction(id: number): Promise<void> {
	try {
		await checkUser();

		await prisma.$transaction(async (tx) => {
			// Обновляем статус транзакции
			const transaction = await tx.transaction.update({
				where: { id },
				data: { 
					status: 'COMPLETED',
					initiator: 'TREADER',
				},
			});

			await tx.user.update({
				where: { id: transaction.userId },
				data: {
					balance: {
						increment: transaction.amountInCurrencyFee,
					},
					fundsBlocked: {
						decrement: transaction.amountInCurrency,
					}
				}
			});
		});

		// Обновляем кеш после успешной транзакции
		revalidatePath("/deals");

	} catch (error) {
		console.error("Failed to update transaction status:", error);
		// Можно также пробросить ошибку или отправить уведомление
		throw new Error("Could not complete the transaction update.");
	}
}

export async function getTransactionById(id: number): Promise<HistoryTransaction | null> {
	await checkUser();

	const transaction = await prisma.transaction.findUnique({
		where: {
			id: id
		},
		select:{
			id: true,
			num: true,
			status: true,
			updatedAt: true,
			type: true,
			amount: true,
			initiator: true,
			rate: true,
			amountInCurrency: true,
			amountInCurrencyFee: true,
			requisites: {
				select: {
					id: true,
					cardOwner: true,
					card: true,
					currency: {
						select: {
							symbol: true
						}
					},
					paymentMethod: {
						select: {
							name: true
						}
					},
					bankName: {
						select: {
							name: true
						}
					},
				},
			},
		}
	});

	if (!transaction) {
		throw new Error("Transaction not found");
	}

	return transaction;
}

export async function getTransactionByFilter(data: TransactionFilter): Promise<ITransaction[]> {
	const user = await checkUser();
	const from = data.from;
	const to = data.to;
	const status = data.status;
	const type = data.type;

	const filter: any = {
		userId: user.id,
	};

	if (type) {
		filter.type = type;
	}

	if(status){
		filter.status = status;
	}

	if (from) {
		filter.createdAt = { gte: new Date(from) };
	}

	if (to) {
		filter.createdAt = { ...filter.createdAt, lte: new Date(to) };
	}
	
	try {
		const transactions = await prisma.transaction.findMany({
			where: filter,
			select: {
				id: true,
				num: true,
				amount: true,
				rate: true,
				status: true,
				type: true,
				initiator: true,
				createdAt: true,
				updatedAt: true,
				amountInCurrency: true,
				amountInCurrencyFee: true,
				requisites: {
					select: {
						cardOwner: true,
						card: true,
						currency: {
							select: {
								symbol: true
							}
						},
						paymentMethod: {
							select: {
								name: true
							}
						},
						bankName: {
							select: {
								name: true
							}
						}
					}
				}
			}
		});

		return transactions;
	} catch (error) {
		console.error("Error fetching transactions by filter:", error);
		throw new Error("Failed to fetch transactions by filter");
	}
}

export async function getTransactionByPeriod(period: StatisticPeriod): Promise<StatisticTransaction[]> {
	const user = await checkUser();

	const startDate = new Date();
	const endDate = new Date();

	switch (period) {
		case StatisticPeriod.Today:
			startDate.setHours(0, 0, 0, 0);
			endDate.setHours(23, 59, 59, 999);
			break;
		case StatisticPeriod.Yesterday:
			startDate.setDate(startDate.getDate() - 1);
			startDate.setHours(0, 0, 0, 0);
			endDate.setDate(endDate.getDate() - 1);
			endDate.setHours(23, 59, 59, 999);
			break;
		case StatisticPeriod.Weekly:
			startDate.setDate(startDate.getDate() - 7);
			startDate.setHours(0, 0, 0, 0);
			endDate.setHours(23, 59, 59, 999);
			break;
		case StatisticPeriod.Monthly:
			startDate.setDate(startDate.getDate() - 30);
			startDate.setHours(0, 0, 0, 0);
			endDate.setHours(23, 59, 59, 999);
			break;
		case StatisticPeriod.All:
			startDate.setFullYear(2020); // Arbitrary start date
			startDate.setHours(0, 0, 0, 0);
			endDate.setHours(23, 59, 59, 999);
			break;
		default:
			throw new Error("Invalid period specified");
	}

	console.log("Fetching transactions from", startDate.toLocaleString(), "to", endDate.toLocaleString());

	try {
		const transactions = await prisma.transaction.findMany({
			where: {
				userId: user.id,
				createdAt: {
					gte: startDate,
					lte: endDate
				},
				NOT: {
					status: 'PENDING'
				}
			},
			select: {
				id: true,
				num: true,
				initiator: true,
				status: true,
				type: true,
				amount: true,
				amountInCurrency: true,
				amountInCurrencyFee: true,
				rate: true,
				updatedAt: true,
				requisites: {
					select: {
						bankName: true,
						currency: true,
						paymentMethod: true
					}
				},
			}
		});

		return transactions;
	} catch (error) {
		console.error("Error fetching transactions by period:", error);
		throw new Error("Failed to fetch transactions by period");
	}
}

async function checkUser(): Promise<{ id: number, balance: number, fundsBlocked: number }> {
	const cookie = await cookies();
	const email = cookie.get("email")?.value;
	if (!email) {
		throw new Error("User email not found in cookies.");
	}

	const user = await prisma.user.findUnique({
		where: { email: email },
		select: { id: true, balance: true, fundsBlocked: true }
	});

	if (!user) {
		throw new Error("User not found.");
	}

	return user;
}