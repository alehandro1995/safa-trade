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

const chartData = [
	{day: "03:00", amount: 200},
	{day: "06:00", amount: 500},
	{day: "9:00", amount: 300},
	{day: "12:00", amount: 400},
	{day: "15:00", amount: 500},
	{day: "18:00", amount: 600},
	{day: "21:00", amount: 700},
	{day: "00:00", amount: 200}
]

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

  return (
    <Card className="col-span-6 p-4">
			<CardHeader className="flex flex-col gap-2">
				<CardTitle>Статистика за {periodLabel}</CardTitle>
				<CardDescription className="text-sm text-gray-500">
					Общая сумма: {totalAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} руб.
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