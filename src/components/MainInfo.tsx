'use client';
import { 
	IoCard, 
	IoCash, 
	IoTrendingUp, 
	IoAnalyticsOutline 
} from "react-icons/io5";

import type { StatisticTransaction } from "@/types/Statistic";

const getTotal = (data: StatisticTransaction[]) => {
	let result = 0;
	data.forEach((tx) => {
		if (tx.status === 'COMPLETED') {
			result += tx.amountInCurrency || 0;
		}
	});

	return result;
}

const getTotalFees = (data: StatisticTransaction[]) => {
	let result = 0;
	data.forEach((tx) => {
		if(tx.status === 'COMPLETED'){
			result += tx.amountInCurrencyFee || 0;
		}
	});

	return result;
}

const setConversionRate = (total: number, data: StatisticTransaction[]) => {
	let completeDeals = data.filter((tx) => tx.status === 'COMPLETED').length;

	if(total === 0) return 0;

	return completeDeals === 0 ? 0 : total / completeDeals;
}
function MainInfo({transactions}: {transactions: StatisticTransaction[]}) {
	let totalTurnover = getTotal(transactions);
	let totalIncome = getTotalFees(transactions);
	let totalDeals = transactions.length;
	let conversionRate = setConversionRate(totalTurnover, transactions);

	return ( 
		<>
			<div className="bg-green-700 p-5 rounded-lg text-emerald-100 flex items-center justify-between">
				<div>
					<h4 className="text-lg font-semibold">Оборот</h4>
					<h5 className="text-3xl font-extrabold">
						{totalTurnover === 0 ? "0.00$" : totalTurnover.toFixed(2) + "$"}
					</h5>
				</div>
				<div className="w-12 h-12 flex items-center justify-center bg-green-800 rounded-full">
					<IoCard className="text-emerald-100 text-3xl" />
				</div>
			</div>
			<div className="bg-green-700 p-5 rounded-lg text-emerald-100 flex items-center justify-between">
				<div>
					<h4 className="text-lg font-semibold">Доход</h4>
					<h5 className="text-3xl font-extrabold">
						{totalIncome === 0 ? "0.00$" : totalIncome.toFixed(2) + "$"}
					</h5>
				</div>
				<div className="w-12 h-12 flex items-center justify-center bg-green-800 rounded-full">
					<IoCash className="text-emerald-100 text-3xl" />
				</div>
			</div>
			<div className="bg-green-700 p-5 rounded-lg text-emerald-100 flex items-center justify-between">
				<div>
					<h4 className="text-lg font-semibold">Сделки</h4>
					<h5 className="text-3xl font-extrabold">
						{totalDeals === 0 ? "0" : totalDeals}
					</h5>
				</div>
				<div className="w-12 h-12 flex items-center justify-center bg-green-800 rounded-full">
					<IoTrendingUp className="text-emerald-100 text-3xl" />
				</div>
			</div>
			<div className="bg-green-700 p-5 rounded-lg text-emerald-100 flex items-center justify-between">
				<div>
					<h4 className="text-lg font-semibold">Средний чек</h4>
					<h5 className="text-3xl font-extrabold">
						{conversionRate === 0 ? "0.00$" : conversionRate.toFixed(2) + "$"}
					</h5>
				</div>
				<div className="w-12 h-12 flex items-center justify-center bg-green-800 rounded-full">
					<IoAnalyticsOutline className="text-emerald-100 text-3xl" />
				</div>
			</div>
		</>
	);
}

export default MainInfo;