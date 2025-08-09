import { 
	currency, 
	bank_name, 
	payment_method,
	TransactionStatus,
	TransactionType
} from "@/generated/prisma";

export enum StatisticPeriod {
	Today = "today",
	Yesterday = "yesterday",
	Weekly = "weekly",
	Monthly = "monthly",
	All = "all",
}

export interface StatisticRequisites {
	bankName: bank_name;
	currency: currency;
	paymentMethod: payment_method;
}

export interface StatisticTransaction {
	id: number,
	num: string,
  initiator: string,
	status: TransactionStatus,
	type: TransactionType,
	amount: number,
	amountInCurrency: number,
	amountInCurrencyFee: number,
	updatedAt: Date,
	requisites: StatisticRequisites,
}