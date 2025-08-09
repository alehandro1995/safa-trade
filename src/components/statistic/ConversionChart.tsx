"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { 
	Area, 
	AreaChart, 
	CartesianGrid, 
	XAxis 
} from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { date: "Понедельник", completed: 186, canceled: 80 },
  { date: "Вторник", completed: 305, canceled: 200 },
  { date: "Среда", completed: 237, canceled: 120 },
  { date: "Четверг", completed: 73, canceled: 190 },
  { date: "Пятница", completed: 209, canceled: 130 },
  { date: "Суббота", completed: 214, canceled: 140 },
	{ date: "Воскресенье", completed: 200, canceled: 90 },
];

const chartConfig = {
  completed: {
    label: "Завершенные",
    color: "var(--chart-1)",
  },
  canceled: {
    label: "Отмененные",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

import { 
	StatisticPeriod, 
	StatisticTransaction 
} from "@/types/Statistic";

type ConversionChartProps = {
	data: StatisticTransaction[];
	period: StatisticPeriod;
};

function ConversionChart({data, period}: ConversionChartProps) {

	return ( 
		<Card className="col-span-4 p-4">
			<CardHeader className="flex flex-col gap-2">
				<CardTitle>Конверсия</CardTitle>
				<CardDescription className="text-sm text-gray-500">
					Здесь будет график конверсии
				</CardDescription>
			</CardHeader>
			<CardContent className="p-0">
				<ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="canceled"
              type="natural"
              fill="var(--color-canceled)"
              fillOpacity={0.4}
              stroke="var(--color-canceled)"
              stackId="a"
            />
            <Area
              dataKey="completed"
              type="natural"
              fill="var(--color-completed)"
              fillOpacity={0.4}
              stroke="var(--color-completed)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
			</CardContent>
		</Card>
	);
}

export default ConversionChart;