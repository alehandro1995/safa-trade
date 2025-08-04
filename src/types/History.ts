import { 
	TransactionType,
	Transaction 
} from "@/generated/prisma";

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
	requisites: {
		currency: {
			symbol: string
		}
	}
}

export type HistoryColumns = {
	id: number,
	createdAt: Date,
	amount: string,
	type: TransactionType,
	status: string,
}

export interface TransactionWithHistory extends Transaction {
	requisites: {
		id: number;
		cardOwner: string;
		card: string;
		currency: {
			symbol: string;
		};
	};
}