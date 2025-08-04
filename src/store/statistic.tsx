import { create } from 'zustand';

interface StatisticState {
	status: string;
	length: number;
	sum: number;
	fee: number;
	setStatistic: (status: string, length: number, sum: number, fee: number) => void;
}
export const useStatisticStore = create<StatisticState>((set) => ({
	status: "",
	length: 0,
	sum: 0,
	fee: 0,
	setStatistic: (status: string, length: number, sum: number, fee: number) => set({ status, length, sum, fee}),
}));