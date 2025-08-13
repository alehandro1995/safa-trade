"use client";
import { useMemo } from "react";
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
	XAxis,
	YAxis
} from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

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
	const chartData = useMemo(() => {
		const map = new Map<string, { completed: number; canceled: number }>();

		data.forEach(item => {``
			const date = new Date(item.updatedAt)
			const dayLabel = date.toLocaleDateString("ru-RU", {
				day: "2-digit",
				month: "2-digit"
			}).replace(".", ":").replace(".", "");

			if (!map.has(dayLabel)) {
				map.set(dayLabel, { completed: 0, canceled: 0 });
			}

			if (item.status === "COMPLETED") {
				map.get(dayLabel)!.completed++;
			}
			if (item.status === "CANCELED") {
				map.get(dayLabel)!.canceled++;
			}
		});

		return Array.from(map.entries())
			.sort(([a], [b]) => {
				const [da, ma] = a.split(":").map(Number);
				const [db, mb] = b.split(":").map(Number);
				return ma - mb || da - db;
			})
			.map(([day, counts]) => ({
				day,
				completed: counts.completed,
				canceled: counts.canceled
			}));
	}, [data]);

	return ( 
		<Card className="col-span-4 p-4">
			<CardHeader className="flex flex-col gap-2">
				<CardTitle>Конверсия</CardTitle>
				<CardDescription className="text-sm text-gray-500">
					Август 2025
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