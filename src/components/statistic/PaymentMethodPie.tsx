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
	{ bank: "tgp", amount: 75, fill: "var(--color-tgp)" },
	{ bank: "spb", amount: 200, fill: "var(--color-spb)" },
	{ bank: "card", amount: 387, fill: "var(--color-card)" },
]
const chartConfig = {
	amount: {
		label: "Способ оплаты",
	},
	tgp: {
		label: "Трансграничный перевод",
		color: "var(--chart-2)",
	},
	spb: {
		label: "СПБ",
		color: "var(--chart-1)",
	},
	card: {
		label: "Перевод на карту",
		color: "var(--chart-3)",
	},
} satisfies ChartConfig;

function PaymentMethodPie() {

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

export default PaymentMethodPie;