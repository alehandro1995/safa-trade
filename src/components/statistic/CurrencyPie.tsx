"use client"
import { useMemo } from "react";
import {ChartLegendContent} from "./ChartLegend";
import { Pie, PieChart } from "recharts"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
} from "@/components/ui/chart"

import type { StatisticTransaction } from "@/types/Statistic";

const colors = [
	"oklch(79.2% 0.209 151.711)", 
	"oklch(70.4% 0.191 22.216)", 
	"oklch(76.5% 0.177 163.223)",
	"oklch(69.6% 0.17 162.48)",
	"oklch(59.6% 0.145 163.225)",
	"oklch(49.6% 0.12 164.225)",
	"oklch(98.7% 0.022 95.277)"
];

const chartConfig = {
  amount: {
    label: "Валюта",
  },
  rub: {
    label: "Российский рубль",
  },
	uzs: {
		label: "Узбекский сум",
	},
	kzt:{
		label: "Казахстанский тенге",
	},
  tjs: {
    label: "Таджикский сомони",
  },
  kgs: {
    label: "Киргизский сом",
  },
	gel: {
		label: "Грузинский лари",
	},
  amd: {
    label: "Армянский драм",
  },
} satisfies ChartConfig;

function CurrencyPie({ data }: { data: StatisticTransaction[] }) {
	
	const chartData = useMemo(() => {
		const currencyMap = new Map<string, number>();
		data.forEach(tx => {
			const key = tx.requisites.currency.symbol;
			if (currencyMap.has(key)){
				const value = currencyMap.get(key) ?? 0;
				currencyMap.set(key, value + 1);
			}else{
				currencyMap.set(key, 1);
			}
		});
		return Array.from(currencyMap.entries()).map(([currency, amount], index) => (
			{ currency: currency.toLowerCase(), 
				amount: amount,
				fill: colors[index]
			}
		));
	}, [data]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Соотношение валют</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[380px] gap-5"
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