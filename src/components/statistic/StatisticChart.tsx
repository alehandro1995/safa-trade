"use client"
import { useMemo } from "react";
import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
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
	if (!data || data.length === 0) {
		return <div className="text-center text-gray-500">Нет данных для отображения</div>
	}

	const totalAmount = useMemo(() => {
		return data.reduce((sum, item) => sum + item.amount, 0);
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
				return "этот месяц";
			default:
				return "все время";
		}
	}, [period]);

	const chartData = useMemo(() => {
		const dayMap = new Map<string, { amount: number; count: number }>();

		data.forEach((tx) => {
			const date = new Date(tx.createdAt);
			const day = date.toLocaleDateString("ru-RU", { weekday: "short" }); // 'пн', 'вт' и т.д.
			console.log("Day:", day);
			const prev = dayMap.get(day) || { amount: 0, count: 0 };
			dayMap.set(day, {
				amount: prev.amount + tx.amount,
				count: prev.count + 1,
			});
		});

		// Сортировка дней недели по порядку
		const dayOrder = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];

		return Array.from(dayMap.entries())
			.sort((a, b) => dayOrder.indexOf(a[0]) - dayOrder.indexOf(b[0]))
			.map(([day, stats]) => ({
				day,
				amount: stats.amount,
				count: stats.count,
			}));
	}, [data]);


  return (
    <Card className="col-span-3 p-4">
			<CardHeader className="flex flex-col gap-2">
				<CardTitle>Статистика за {periodLabel}</CardTitle>
				<CardDescription className="text-sm text-gray-500">
					Общая сумма: {totalAmount.toLocaleString()} руб.
				</CardDescription>
				<div className="flex items-center gap-2 text-sm text-gray-500">
					<TrendingUp className="h-4 w-4" />
					{data.length} транзакций
				</div>
			</CardHeader>
			<CardContent className="p-0">
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart
            accessibilityLayer
            data={chartData}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
             <ChartTooltip
              cursor={false}
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