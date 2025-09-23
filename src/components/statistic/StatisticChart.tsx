"use client"
import { useMemo } from "react";
import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

import { 
	StatisticPeriod, 
	StatisticTransaction 
} from "@/types/Statistic";

const chartConfig = {
  amount:{
		label: "Сумма",
		color: "var(--chart-1)",
	}
} satisfies ChartConfig;

type StatisticItemProps = {
	data: StatisticTransaction[];
	period: StatisticPeriod;
}

export default function MyChart({ data, period }: StatisticItemProps) {
	const totalAmount = useMemo(() => {
		return data.reduce((sum, item) => sum + item.amountInCurrency, 0);
	}, [data]);

	const periodLabel = useMemo(() => {
		switch (period) {
			case StatisticPeriod.Today:
				return "сегодня";
			case StatisticPeriod.Yesterday:
				return "вчера";
			case StatisticPeriod.Weekly:
				return "неделю";
			case StatisticPeriod.Monthly:
				return "месяц";
			default:
				return "все время";
		}
	}, [period]);

	const chartData = useMemo(() => {
		const map = new Map<string, number>();

		data.forEach(tx => {
			let key;
			const amount = tx.amountInCurrency;
			if (period === StatisticPeriod.Today || period === StatisticPeriod.Yesterday) {
				key = tx.updatedAt.toLocaleString("ru-RU", {year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit"});
				//console.log(key);
				key = `${key}:00`
				if (map.has(key)){
					const value = map.get(key) ?? 0;
					map.set(key, value + amount);
				}else{
					map.set(key, amount);
				}
			} else{
				key = tx.updatedAt.toLocaleDateString("ru-RU");
				if (map.has(key)){
					const value = map.get(key) ?? 0;
					map.set(key, value + amount);
				}else{
					map.set(key, amount);
				}
			}
		});

		if (period === StatisticPeriod.Today || period === StatisticPeriod.Yesterday) {
			return Array.from(map.entries()).sort((a, b) => {
				const paramA = a[0].split(",");
				const dayA = paramA[0].split(".").reverse();
				const hourA = paramA[1].split(":")[0];
				const dateA = new Date(Number(dayA[0]), Number(dayA[1]) - 1, Number(dayA[2]), Number(hourA));
				const paramB = b[0].split(",");
				const dayB = paramB[0].split(".").reverse();
				const hourB = paramB[1].split(":")[0];
				const dateB = new Date(Number(dayB[0]), Number(dayB[1]) - 1, Number(dayB[2]), Number(hourB));
				return dateA.getTime() - dateB.getTime();
			}).map(([key, value]) => {
				const hour = key.split(",")[1]
				return {
					day: hour,
					amount: value
				};
			});
		}else{
			return Array.from(map.entries()).sort((a, b) => {
				const paramA = a[0].split(".").reverse();
				const paramB = b[0].split(".").reverse();
				const dateA = new Date(Number(paramA[0]), Number(paramA[1]) - 1, Number(paramA[2]));
				const dateB = new Date(Number(paramB[0]), Number(paramB[1]) - 1, Number(paramB[2]));
				return dateA.getTime() - dateB.getTime();
			}).map(([key, value]) => {
				const param = key.split(".").slice(0,2);
				const formattedKey = param.join(".");
				return {
					day: formattedKey,
					amount: value
				};
			});
		}
	}, [data]);

  return (
    <Card className="col-span-6 p-4">
			<CardHeader className="flex flex-col gap-2">
				<CardTitle>График поступлений за {periodLabel}</CardTitle>
				<CardDescription className="text-sm text-gray-500">
					Общая сумма: {totalAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
				</CardDescription>
				<div className="flex items-center gap-2 text-sm text-gray-500">
					<TrendingUp className="h-4 w-4" />
					{data.length} транзакций
				</div>
			</CardHeader>
			<CardContent className="p-0">
        <ChartContainer config={chartConfig} className="h-[360px] w-full">
          <AreaChart
            accessibilityLayer
            data={chartData}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={true}
              axisLine={true}
              tickMargin={8}
            />
						<YAxis
              tickLine={true}
              axisLine={true}
              tickMargin={8}
            />
             <ChartTooltip
              cursor={true}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="amount"
              type="natural"
              fill="var(--color-amount)"
              fillOpacity={0.4}
              stroke="var(--color-amount)"
            />
          </AreaChart>
        </ChartContainer>
			</CardContent>
    </Card>
  )
}