import { create } from 'zustand';
import { TransactionStatus, TransactionType } from '../../generated/prisma';

interface DealState {
	status: TransactionStatus;
	type: TransactionType;
	setStatus: (status: TransactionStatus) => void;
	setType: (type: TransactionType) => void;
}

export const useDealStore = create<DealState>((set) => ({
	status: TransactionStatus.PENDING,
	type: TransactionType.RECEIVE,
	setStatus: (status: TransactionStatus) => set({ status }),
	setType: (type: TransactionType) => set({ type }),
}));