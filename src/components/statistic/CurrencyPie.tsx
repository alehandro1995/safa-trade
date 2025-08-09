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
  { currency: "rub", amount: 275, fill: "var(--color-rub)" },
  { currency: "uzs", amount: 200, fill: "var(--color-uzs)" },
  { currency: "kzt", amount: 187, fill: "var(--color-kzt)" },
  { currency: "tjs", amount: 173, fill: "var(--color-tjs)" },
  { currency: "kgs", amount: 90, fill: "var(--color-kgs)" },
]
const chartConfig = {
  amount: {
    label: "Валюта",
  },
  rub: {
    label: "Российский рубль",
    color: "var(--chart-2)",
  },
  uzs: {
    label: "Узбекский сум",
    color: "var(--chart-1)",
  },
  kzt: {
    label: "Казахстанский тенге",
    color: "var(--chart-3)",
  },
  tjs: {
    label: "Таджикский сомони",
    color: "var(--chart-4)",
  },
  kgs: {
    label: "Киргизский сом",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

function CurrencyPie() {

  return (
    <Card className="col-span-2 flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Соотношение валют</CardTitle>
        <CardDescription>Январь - Июнь 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px] gap-5"
        >
          <PieChart>
            <Pie data={chartData} dataKey="amount" nameKey="currency" label/>
            <ChartLegend
              content={<ChartLegendContent  nameKey="currency" chartConfig={chartConfig} />}
              className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default CurrencyPie;