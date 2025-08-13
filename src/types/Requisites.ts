import type { 
	requisites, 
	bank_name, 
	currency, 
	payment_method,
} from "@/generated/prisma";

export interface IRequisites extends requisites {
	bankName: bank_name;
	currency: currency;
	paymentMethod: payment_method;
}

export interface ICreateRequisites {
	userId: number;
	currencyId: number;
	bankId: number;
	paymentId: number;
	cardNumber: string;
	cardOwner: string;
	card: string;
	minOrder?: number;
	maxOrder?: number;
	dayLimit?: number;
	monthLimit?: number;
	dayQuantity?: number;
	monthQuantity?: number;
	concurrentOrder?: number;
	minutesDelay?: number;
}

export interface IUpdateRequisites extends ICreateRequisites {
	id: number;
}

export interface IRequisitesFilter {
	currencyId?: number;
	bankId?: number;
	paymentId?: number;
	status?: number;
}