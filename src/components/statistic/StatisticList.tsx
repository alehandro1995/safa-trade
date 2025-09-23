"use client";
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import {  getTransactionByPeriod } from "@/actions/transactionAction";
import { StatisticPeriod, StatisticTransaction } from "@/types/Statistic";
import StatisticChart from "./StatisticChart";
//import ConversionChart from "./ConversionChart";
import CurrencyPie from "./CurrencyPie";
import BanksPie from "./BanksPie";
import PaymentMethodPie from "./PaymentMethodPie";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

function StatisticList({period}: {period: StatisticPeriod}) {
	const [transactions, setTransactions] = useState<StatisticTransaction[] | null>(null);

	useEffect(() => {
		getTransactionByPeriod(period)
			.then((data: StatisticTransaction[]) => {
				//console.log(data);
				setTransactions(data);
			})
			.catch(() => {
				toast.error("Ошибка при обработке данных попробуйте позже!");
				setTransactions([]);
			});
	}, [period]);

	const totalCount = useMemo(() => transactions?.length || 0, [transactions]);

	const totalAmount = useMemo(() => {
		if (transactions === null) {
			return 0;
		}

		return transactions.reduce((acc, tx) => acc + tx.amountInCurrency , 0);
	}, [transactions]);

	const completedCount = useMemo(() => {
		if (transactions === null) {
			return 0;
		}

		return transactions.filter(tx => tx.status === "COMPLETED").length;
	}, [transactions]);

	const profit = useMemo(() => {
		if (transactions === null) {
			return 0;
		}

		const completedTransactions = transactions.filter(tx => tx.status === "COMPLETED");
		return completedTransactions.reduce((acc, tx) => acc + tx.amountInCurrencyFee, 0);
	}, [totalAmount, transactions]);

	const conversion = useMemo(() => {
		if (totalAmount === 0) {
			return 0;
		}
		return (completedCount / totalCount) * 100;
	}, [profit, totalAmount]);

	const localDate = useMemo(() => {
		switch (period) {
			case StatisticPeriod.Today:
				return new Date().toLocaleDateString("ru-RU", {month:"long", day: "numeric"});
			case StatisticPeriod.Yesterday:
				const date = new Date();
				date.setDate(date.getDate() - 1);
				return date.toLocaleDateString("ru-RU", {month:"long", day: "numeric"});
			case StatisticPeriod.Weekly:
				const startDate = new Date();
				const endDate = new Date();
				startDate.setDate(startDate.getDate() - 7);
				startDate.setHours(0, 0, 0, 0);
				const formattedStartDate = startDate.toLocaleDateString("ru-RU", {month:"long", day: "numeric"});
				const formattedEndDate = endDate.toLocaleDateString("ru-RU", {month:"long", day: "numeric"});
				return `${formattedStartDate} - ${formattedEndDate}`;
			case StatisticPeriod.Monthly:
				return new Date().toLocaleDateString("ru-RU", {month:"long", year: "numeric"});
			default:
				return new Date().toLocaleDateString("ru-RU", { year: "numeric"});
		}
	}, [period]);

	if (transactions === null) {
		return (
			<div className="grid grid-cols-6 gap-4 mt-5">
				<Card className="col-span-3 min-h-[300px] justify-center items-center">
					<Skeleton className="h-full w-full" />
				</Card>
				<Card className="col-span-3 min-h-[300px] justify-center items-center">
					<Skeleton className="h-full w-full" />
				</Card>
				<Card className="col-span-2 min-h-[300px] justify-center items-center">
					<Skeleton className="h-full w-full" />
				</Card>
				<Card className="col-span-2 min-h-[300px] justify-center items-center">
					<Skeleton className="h-full w-full" />
				</Card>
				<Card className="col-span-2 min-h-[300px] justify-center items-center">
					<Skeleton className="h-full w-full" />
				</Card>
			</div>
		);
	}

	return (  
		<div>
			{transactions.length < 10 
				? 
				<div className="grid grid-cols-6 lg:grid-cols-8 gap-4 mt-5">
					<Card className="col-span-6 min-h-[300px] justify-center items-center">
						<CardHeader className="w-full text-center">
							<CardTitle>Нет данных для отображения</CardTitle>
						</CardHeader>
					</Card>
					<Card className="col-span-2 min-h-[300px] justify-center items-center">
						<CardHeader className="w-full text-center">
							<CardTitle>Нет данных для отображения</CardTitle>
						</CardHeader>
					</Card>
					<Card className="col-span-4 min-h-[300px] justify-center items-center">
						<CardHeader className="w-full text-center">
							<CardTitle>Нет данных для отображения</CardTitle>
						</CardHeader>
					</Card>
					<Card className="col-span-2 min-h-[300px] justify-center items-center">
						<CardHeader className="w-full text-center">
							<CardTitle>Нет данных для отображения</CardTitle>
						</CardHeader>
					</Card>
					<Card className="col-span-2 min-h-[300px] justify-center items-center">
						<CardHeader className="w-full text-center">
							<CardTitle>Нет данных для отображения</CardTitle>
						</CardHeader>
					</Card>
				</div>
			  : 
				<div className="flex flex-col gap-5">
						<Table className="mt-5 border border-border">
							<TableCaption>Статистика транзакций</TableCaption>
							<TableHeader>
								<TableRow className="divide-x divide-border">
									<TableHead className="font-medium">Период</TableHead>
									<TableHead>Кол-во транзакций</TableHead>
									<TableHead>Общая сумма</TableHead>
									<TableHead>Профит</TableHead>
									<TableHead className="text-right">Конверсия</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								<TableRow className="divide-x divide-border">
									<TableCell className="font-medium">{localDate}</TableCell>
									<TableCell className="font-medium">{totalCount}</TableCell>
									<TableCell>{totalAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</TableCell>
									<TableCell>{profit.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</TableCell>
									<TableCell className="text-right">{conversion.toFixed(2)}%</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					<StatisticChart data={transactions} period={period} />
					<div className="grid grid-cols-3 gap-5">
						<CurrencyPie data={transactions} />
						<BanksPie data={transactions} />
						<PaymentMethodPie data={transactions} />
					</div>
				</div>
			}	
		</div>
	);
}

export default StatisticList;