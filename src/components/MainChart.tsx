"use client";
import { useState, useEffect } from 'react'
import { 
	Bar, 
	BarChart, 
	CartesianGrid, 
	XAxis 
} from "recharts";

import { 
	ChartContainer, 
	ChartTooltipContent, 
	ChartTooltip, 
	ChartLegend, 
	ChartLegendContent 
} from "@/components/ui/chart";
//import { TransactionStatus } from '../../generated/prisma';
import { type ChartConfig } from "@/components/ui/chart";
import type { StatisticTransaction } from "@/types/Statistic";
 
const chartConfig = {
  completed: {
    label: "Completed",
    color: "var(--chart-1)",
  },
  canceled: {
    label: "Canceled",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

type ChartType = {
	day: string;
	completed: number;
	canceled: number;
}

export function MainChart({transactions}: {transactions: StatisticTransaction[]}) {
	const [chartData, setChartData] = useState<ChartType[]>([]);
	
	useEffect(() => {
		if (!transactions) return;

		const dayMap = new Map<string, { completed: number; canceled: number }>();
		transactions.forEach((tx) => {
			const date = new Date(tx.updatedAt);
			const day = date.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit" });
			//console.log("Day:", day);
			if(tx.status === "COMPLETED") {
				const prev = dayMap.get(day) || { completed: 0, canceled: 0 };
				dayMap.set(day, {
					completed: prev.completed + 1,
					canceled: prev.canceled,
				});
			} else if(tx.status === "CANCELED") {
				const prev = dayMap.get(day) || { completed: 0, canceled: 0 };
				dayMap.set(day, {
					completed: prev.completed,
					canceled: prev.canceled + 1,
				});
			}
		});
	
		const result = Array.from(dayMap.entries()).map(([day, { completed, canceled }]) => ({
			day,
			completed,
			canceled,
		})).sort((a, b) => {
			const [dayA, monthA] = a.day.split(".");
			const [dayB, monthB] = b.day.split(".");
			return new Date(`2025-${monthA}-${dayA}`).getTime() - new Date(`2025-${monthB}-${dayB}`).getTime();
		});
		setChartData(result);
	}, [transactions]);
	console.log("Chart Data:", chartData.length, chartData);
  return (
		<>
			{transactions.length < 10
			?
			<div className="flex items-center justify-center h-full w-full">
				<p className='font-semibold'>Нет данных для отображения</p>
			</div>
			:
			<ChartContainer config={chartConfig} className="min-h-[200px] w-full">
				<BarChart accessibilityLayer data={chartData}>
					<CartesianGrid vertical={false} />
					<XAxis
						dataKey="day"
						tickLine={false}
						tickMargin={10}
						axisLine={false}
					/>
					<ChartTooltip content={<ChartTooltipContent />} />
					<ChartLegend content={<ChartLegendContent />} />
					<Bar dataKey="completed" fill="var(--color-completed)" radius={4} />
					<Bar dataKey="canceled" fill="var(--color-canceled)" radius={4} />
				</BarChart>
			</ChartContainer>
			}
		</>
  )
}