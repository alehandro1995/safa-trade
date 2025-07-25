import { TransactionStatus, TransactionHistory } from "../../generated/prisma";

type TransactionHistoryStatus = Pick<TransactionHistory, "id" | "transactionStatus" | "createdAt" | "rate" | "amountInCurrency" | "amountInCurrencyFee" | "initiator">;
type TransactionHistoryByFilter = Omit<TransactionHistoryStatus, "id" | "initiator" | "createdAt" | "rate">

export interface ITransaction {
	id: number;
	num: string;
	amount: number;
	status: TransactionStatus;
	createdAt: Date;
	requisites: {
		card: string;
		cardOwner: string;
		currency: { symbol: string };
		paymentMethod: { name: string };
		bankName: { name: string };
	};
	transactionHistory: TransactionHistoryStatus[];
}

export interface ITransactionByFilter {
	status: TransactionStatus;
	transactionHistory: TransactionHistoryByFilter[];
}

export type TransactionFilter = {
	from?: string;
	to?: string;
	status?: TransactionStatus;
}