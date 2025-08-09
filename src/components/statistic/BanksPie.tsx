"use client"
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
//import { Currency } from "lucide-react"

const chartData = [
	{ bank: "sber", amount: 275, fill: "var(--color-sber)" },
	{ bank: "alfa", amount: 200, fill: "var(--color-alfa)" },
	{ bank: "tink", amount: 187, fill: "var(--color-tink)" },
	{ bank: "vasl", amount: 173, fill: "var(--color-vasl)" },
	{ bank: "vtb", amount: 90, fill: "var(--color-vtb)" },
]
const chartConfig = {
	amount: {
		label: "Банк",
	},
	sber: {
		label: "Сбербанк",
		color: "var(--chart-2)",
	},
	alfa: {
		label: "Альфа-Банк",
		color: "var(--chart-1)",
	},
	tink: {
		label: "Тинькофф",
		color: "var(--chart-3)",
	},
	vasl: {
		label: "НБКО Васл",
		color: "var(--chart-4)",
	},
	vtb: {
		label: "ВТБ",
		color: "var(--chart-5)",
	},
} satisfies ChartConfig;

function BanksPie() {

	return (
		<Card className="col-span-2 flex flex-col">
			<CardHeader className="items-center pb-0">
				<CardTitle>Соотношение банков</CardTitle>
				<CardDescription>Январь - Июнь 2024</CardDescription>
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

export default BanksPie;