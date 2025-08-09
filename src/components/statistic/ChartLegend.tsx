import { ChartConfig } from "@/components/ui/chart"

interface ChartLegendContentProps {
	payload?: any[];
	nameKey: string;
	chartConfig: ChartConfig;
}

export function ChartLegendContent({
	payload,
	nameKey,
	chartConfig,
}: ChartLegendContentProps) {
	if (!payload) return null;

	return (
		<div className="flex flex-wrap justify-center items-center w-full gap-2 relative top-5">
			{payload.map((entry, index) => {
				const keyName = entry.payload[nameKey]; // например 'rub'
				const configItem = chartConfig[keyName as keyof typeof chartConfig];
				const label = configItem?.label ?? keyName;
				const color = configItem?.color ?? entry.color;

				return (
					<div
						key={`${keyName}-${index}`} // уникальный ключ
						className="flex items-center gap-x-1"
					>
						<span
							className="w-3 h-3 rounded-full"
							style={{ backgroundColor: color }}
						/>
						<span className="text-nowrap">{label}</span>
					</div>
				);
			})}
		</div>
	);
}