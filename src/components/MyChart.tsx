"use client";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { 
	ChartContainer, 
	ChartTooltipContent, 
	ChartTooltip, 
	ChartLegend, 
	ChartLegendContent 
} from "@/components/ui/chart";
import { type ChartConfig } from "@/components/ui/chart";
 
const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
  },
} satisfies ChartConfig;

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
	{ month: "July", desktop: 218, mobile: 120 },
	{ month: "August", desktop: 200, mobile: 150 },
	{ month: "September", desktop: 250, mobile: 170 },
	{ month: "October", desktop: 300, mobile: 180 },
	{ month: "November", desktop: 280, mobile: 160 },
	{ month: "December", desktop: 320, mobile: 190 },
]

export function MyChart() {
  return (
     <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={chartData}>
				<CartesianGrid vertical={false} />
				<XAxis
					dataKey="month"
					tickLine={false}
					tickMargin={10}
					axisLine={false}
					tickFormatter={(value) => value.slice(0, 3)}
				/>
				<ChartTooltip content={<ChartTooltipContent />} />
    		<ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}