"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {  getTransactionByPeriod } from "@/actions/transactionAction";
import { StatisticPeriod, StatisticTransaction } from "@/types/Statistic";
import StatisticChart from "./StatisticChart";
import ConversionChart from "./ConversionChart";
import CurrencyPie from "./CurrencyPie";
import BanksPie from "./BanksPie";
import PaymentMethodPie from "./PaymentMethodPie";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

function StatisticList({period}: {period: StatisticPeriod}) {
	const [transactions, setTransactions] = useState<StatisticTransaction[] | null>(null);

	useEffect(() => {
		getTransactionByPeriod(period)
			.then((data: StatisticTransaction[]) => {
				console.log(data);
				setTransactions(data);
			})
			.catch(() => {
				toast.error("Ошибка при обработке данных попробуйте позже!");
				setTransactions([]);
			});
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
			 	<div className="grid grid-cols-8 gap-4 mt-5">
					<StatisticChart data={transactions} period={period} />	
					<CurrencyPie />
					<BanksPie />
					<PaymentMethodPie />
					<ConversionChart data={transactions} period={period} />
				</div>
			}	
		</div>
	);
}

export default StatisticList;