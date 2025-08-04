import type { 
	requisites, 
	bank_name, 
	currency, 
	payment_method, 
	Group,
	Device 
} from "@/generated/prisma";

export interface IRequisites extends requisites {
	bankName: bank_name;
	currency: currency;
	paymentMethod: payment_method;
	group: Group | null;
	device: Device | null;
}

export interface ICreateRequisites {
	userId: number;
	currencyId: number;
	bankId: number;
	paymentId: number;
	cardNumber: string;
	cardOwner: string;
	card: string;
	groupId?: number;
	deviceId?: number;
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
	groupId?: number;
}