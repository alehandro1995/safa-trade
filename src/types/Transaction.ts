import { TransactionStatus } from "@/generated/prisma";

export interface ITransaction {
	id: number;
	num: string;
	amount: number;
	status: TransactionStatus;
	rate: number;
	amountInCurrency: number;
	amountInCurrencyFee: number;
	createdAt: Date;
	requisites: {
		card: string;
		cardOwner: string;
		currency: { symbol: string };
		paymentMethod: { name: string };
		bankName: { name: string };
	};
}

export interface ITransactionByFilter {
	status: TransactionStatus;
}

export type TransactionFilter = {
	from?: Date;
	to?: Date;
	status?: TransactionStatus;
}

export enum DealStatus {
	PENDING = 'Активные',
	COMPLETED = 'Завершенные',
	CANCELED = 'Отмененные',
	FAILED = 'Неудачные',
	REFUNDED = 'Возврат',
	DISPUTED = 'Споры',
}