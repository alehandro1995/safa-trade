import { TransactionType } from "../../generated/prisma";

export interface IHistoryFilter {
	totalCount: number;
	history: HistoryType[];
}

export type HistoryFilter  = {
	order?: string;
	from?: string;
	to?: string;
	type?: TransactionType;
};

export type HistoryType = {
	id: number,
	createdAt: Date,
	type: TransactionType,
	amount: number,
	balanceBefore: number,
	balanceAfter: number,
	requisites: {
		currency: {
			symbol: string
		}
	}
}