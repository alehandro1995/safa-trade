"use client"
import { useMemo } from "react";
import {ChartLegendContent} from "./ChartLegend";
import { Pie, PieChart } from "recharts"
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
	ChartLegend,
} from "@/components/ui/chart"

const colors = [
	"oklch(79.2% 0.209 151.711)", 
	"oklch(70.4% 0.191 22.216)", 
	"oklch(76.5% 0.177 163.223)",
	"oklch(69.6% 0.17 162.48)",
	"oklch(59.6% 0.145 163.225)",
	"oklch(49.6% 0.12 164.225)",
	"oklch(98.7% 0.022 95.277)"
];

import type { StatisticTransaction } from "@/types/Statistic";

function PaymentMethodPie({data}: {data: StatisticTransaction[]}) {
	
	const chartData = useMemo(() => {
		const bankMap = new Map<string, number>();
	
		data.forEach(tx => {
			const key = tx.requisites.paymentMethod.uuid;
			if (bankMap.has(key)) {
				const value = bankMap.get(key) ?? 0;
				bankMap.set(key, value + 1);
			} else {
				bankMap.set(key, 1);
			}
		});
	
		return Array.from(bankMap.entries()).map(([bank, amount], index) => {
			return { bank: bank, 
				amount: amount,
				fill: colors[index]
			}
		});
	}, [data]);
	
	const chartConfig = useMemo<ChartConfig>(() => {
		const result: Record<string, { label: string }> = {};

		data.forEach(tx => {
			result[tx.requisites.paymentMethod.uuid] = {
				label: tx.requisites.paymentMethod.name
			};
		});
			
		return result;
	}, [data]);

	return (
		<Card className="flex flex-col">
			<CardHeader className="items-center pb-0">
				<CardTitle>Способы оплаты</CardTitle>
				<CardDescription>Август 2025</CardDescription>
			</CardHeader>
			<CardContent className="flex-1 p-0">
				<ChartContainer
					config={chartConfig}
					className="mx-auto aspect-square max-h-[380px]"
				>
					<PieChart>
						<Pie data={chartData} dataKey="amount" nameKey="bank" label/>
						<ChartLegend
							content={<ChartLegendContent  nameKey="bank" chartConfig={chartConfig} />}
							className="-translate-y-10 flex-wrap gap-2 *:basis-1/4 *:justify-center"
						/>
					</PieChart>
				</ChartContainer>
			</CardContent>
		</Card>
	)
}

export default PaymentMethodPie;