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
	{ bank: "vasl", amount: 308, fill: "var(--color-vasl)" },
	{ bank: "dcbank", amount: 277, fill: "var(--color-dcbank)" },
	{ bank: "alif", amount: 247, fill: "var(--color-alif)" },
	{ bank: "eschata", amount: 185, fill: "var(--color-eschata)" },
	{ bank: "another", amount: 527, fill: "var(--color-another)" },
]
const chartConfig = {
	amount: {
		label: "Банк",
	},
	vasl: {
		label: "НБКО Васл",
		color: "var(--chart-1)",
	},
	dcbank: {
		label: "Душанбе Сити",
		color: "var(--chart-2)",
	},
	alif: {
		label: "Alif Bank",
		color: "var(--chart-3)",
	},
	eschata: {
		label: "Эсхата",
		color: "var(--chart-4)",
	},
	another: {
		label: "Другие банки",
		color: "var(--chart-5)",
	},
} satisfies ChartConfig;

function BanksPie() {

	return (
		<Card className="col-span-2 flex flex-col">
			<CardHeader className="items-center pb-0">
				<CardTitle>Соотношение банков</CardTitle>
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

export default BanksPie;