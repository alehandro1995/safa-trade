"use server";
import {prisma} from "@/client";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { TransactionStatus } from "../../generated/prisma";
import { ITransactionByFilter } from "@/types/Transaction";

export async function completeTransaction(id: number) {
	try {
		const user = await checkUser();
		const txHistory = await prisma.transactionHistory.findFirst({
			where: {
				transactionId: id,
				transactionStatus: 'PENDING'
			},
			orderBy: {
				createdAt: 'desc'
			}
		});

		if (!txHistory) {
			throw new Error("Transaction history not found for this transaction.");
		}

		await prisma.$transaction(async (tx) => {
			// Обновляем статус транзакции
			await tx.transaction.update({
				where: { id },
				data: { 
					status: 'COMPLETED',
					balanceBefore: user.balance,
					balanceAfter: user.balance + txHistory.amountInCurrencyFee, 
				},
			});

			await tx.transactionHistory.create({
				data: {
					transactionId: id,
					transactionStatus: 'COMPLETED',
					rate: txHistory.rate,
					amountInCurrency: txHistory.amountInCurrency,
					amountInCurrencyFee: txHistory.amountInCurrencyFee,
					initiator: 'TREADER'
				}
			});

			await tx.user.update({
				where: { id: user.id },
				data: {
					balance: user.balance + txHistory.amountInCurrencyFee,
					fundsBlocked: user.fundsBlocked - txHistory.amountInCurrency
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

export async function getTransactionById(id: number) {
	const transaction = await prisma.transaction.findUnique({
		where: {
			id: id
		},
		include: {
			transactionHistory: true,
			requisites: true,
		}
	});

	if (!transaction) {
		throw new Error("Transaction not found");
	}

	return transaction;
}

export async function getTransactionByFilter(formData: FormData): Promise<ITransactionByFilter[]> {
	const user = await checkUser();
	const from = formData.get("from")?.toString();
	const to = formData.get("to")?.toString();
	const status = formData.get("status")?.toString();
	//console.log("Фильтр статистики:", { from, to, status });
	
	if (!status){
		throw new Error("Invalid status filter");
	}

	const transactionStatus: TransactionStatus = status as TransactionStatus;
	const filter: any = {};
	filter.userId = user.id;
	filter.status =  transactionStatus;

	if (from) {
		filter.createdAt = { gte: new Date(from) };
	}

	if (to) {
		filter.createdAt = { ...filter.createdAt, lte: new Date(to) };
	}
	
	const transactions = await prisma.transaction.findMany({
		where: filter,
		select:{
			status: true,
			transactionHistory:{
				where: {
					transactionStatus:  transactionStatus,
				},
				select: {
					createdAt: true,
					transactionStatus: true,
					amountInCurrency: true,
					amountInCurrencyFee: true,
				},
			}
		}
	});

	return transactions;
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