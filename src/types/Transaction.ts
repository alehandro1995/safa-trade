import { 
	TransactionStatus, 
	TransactionType,
	TransactionInitiator
} from "@/generated/prisma";

export interface ITransaction {
	id: number;
	num: string;
	amount: number;
	status: TransactionStatus;
	type: TransactionType;
	rate: number;
	amountInCurrency: number;
	amountInCurrencyFee: number;
	initiator: TransactionInitiator;
	createdAt: Date;
	updatedAt: Date;
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
	type?: TransactionType;
}

export enum DealStatus {
	PENDING = 'Активные',
	COMPLETED = 'Завершенные',
	CANCELED = 'Отмененные',
	FAILED = 'Неудачные',
	REFUNDED = 'Возврат',
	DISPUTED = 'Споры',
}