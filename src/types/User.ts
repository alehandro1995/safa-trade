export interface IUserInfo{
	id: number;
	email: string;
	balance: number;
	fundsBlocked: number;
	payInGambling: number;
	payInExchangers: number;
	payOutGambling: number;
	payOutExchangers: number;
	paymentStatus: boolean;
	receiveStatus: boolean;
} 