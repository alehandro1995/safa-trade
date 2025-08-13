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
import { fa } from "zod/v4/locales";

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

/*
const chartData = [
	{day: "31:07", amount: 121},
	{day: "01:08", amount: 25},
	{day: "02:08", amount: 73},
	{day: "03:08", amount: 55},
	{day: "04:08", amount: 500},
	{day: "05:08", amount: 600},
	{day: "06:08", amount: 700},
	{day: "07:08", amount: 200},
	{day: "08:08", amount: 300},
	{day: "09:08", amount: 400},
	{day: "10:08", amount: 500},
	{day: "11:08", amount: 600},
	{day: "12:08", amount: 700},
]
*/
export default function MyChart({ data, period }: StatisticItemProps) {
	console.log("Data:", data);
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
				return "этот месяц";
			default:
				return "все время";
		}
	}, [period]);

	const chartData = useMemo(() => {
		const map = new Map<string, number>();

		data.forEach(item => {
			const date = new Date(item.updatedAt);
			// Форматируем как DD:MM
			const dayLabel = date.toLocaleDateString("ru-RU", {
				day: "2-digit",
				month: "2-digit"
			}).replace(".", ":").replace(".", "");

			map.set(dayLabel, (map.get(dayLabel) || 0) + item.amountInCurrency);
		});

		// Преобразуем в массив объектов для графика
		return Array.from(map.entries())
			.sort(([a], [b]) => {
				const [da, ma] = a.split(":").map(Number);
				const [db, mb] = b.split(":").map(Number);
				return ma - mb || da - db;
			})
			.map(([day, amount]) => ({
				day,
				amount
			}));
	}, [data]);

  return (
    <Card className="col-span-6 p-4">
			<CardHeader className="flex flex-col gap-2">
				<CardTitle>Статистика за Август 2025</CardTitle>
				<CardDescription className="text-sm text-gray-500">
					Общая сумма: {totalAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
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