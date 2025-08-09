import { 
	TransactionType,
	Transaction 
} from "@/generated/prisma";

type History = Pick<Transaction, "id" | "num" | "status" | "updatedAt" | "type" | "amount" | "initiator" | "rate" | "amountInCurrency" | "amountInCurrencyFee">;

export type HistoryColumns = {
	id: number,
	num: string,
	updatedAt: Date,
	amount: number,
	type: TransactionType,
	status: string,
}

export interface HistoryTransaction extends History {
	requisites: {
		id: number;
		cardOwner: string;
		card: string;
		currency: {
			symbol: string;
		};
	};
}