"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {  getTransactionByPeriod } from "@/actions/transaction";
import { StatisticPeriod, StatisticTransaction } from "@/types/Statistic";
import StatisticChart from "./StatisticChart";
import ConversionChart from "./ConversionChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
		return <div>Loading...</div>;
	}

	return (  
		<div>
			{transactions.length < 10 
				? 
				<div className="grid grid-cols-6 gap-4 mt-5">
					<Card className="col-span-3 min-h-[300px] justify-center items-center">
						<CardHeader className="w-full text-center">
							<CardTitle>Нет данных для отображения</CardTitle>
						</CardHeader>
					</Card>
					<Card className="col-span-3 min-h-[300px] justify-center items-center">
						<CardHeader className="w-full text-center">
							<CardTitle>Нет данных для отображения</CardTitle>
						</CardHeader>
					</Card>
				</div>
			  : 
			 	<div className="grid grid-cols-6 gap-4 mt-5">
					<StatisticChart data={transactions} period={period} />	
					<ConversionChart data={transactions} period={period} />
				</div>
			}	
		</div>
	);
}

export default StatisticList;