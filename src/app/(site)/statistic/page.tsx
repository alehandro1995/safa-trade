
import StatisticList from "@/components/statistic/StatisticList";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { 
	Tabs, 
	TabsContent, 
	TabsList, 
	TabsTrigger 
} from "@/components/ui/tabs"

import { StatisticPeriod } from "@/types/Statistic";

function Page() {
	return ( 
		<section className="p-6">
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink href="/">Главная</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator>/</BreadcrumbSeparator>
					<BreadcrumbItem>
						<BreadcrumbPage>Статистика</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
			<Tabs defaultValue={StatisticPeriod.Weekly} className="w-full mt-4">
				<TabsList className=" bg-emerald-100">
					<TabsTrigger value={StatisticPeriod.Today} className="font-oswald tracking-wide cursor-pointer">Сегодня</TabsTrigger>
					<TabsTrigger value={StatisticPeriod.Yesterday} className="font-oswald tracking-wide cursor-pointer">Вчера</TabsTrigger>
					<TabsTrigger value={StatisticPeriod.Weekly} className="font-oswald tracking-wide cursor-pointer">За неделю</TabsTrigger>
					<TabsTrigger value={StatisticPeriod.Monthly} className="font-oswald tracking-wide cursor-pointer">За месяц</TabsTrigger>
					<TabsTrigger value={StatisticPeriod.All} className="font-oswald tracking-wide cursor-pointer">За всё время</TabsTrigger>
				</TabsList>
				<TabsContent value={StatisticPeriod.Today}>
					<StatisticList period={StatisticPeriod.Today} />
				</TabsContent>
				<TabsContent value={StatisticPeriod.Yesterday}>
					<StatisticList period={StatisticPeriod.Yesterday} />
				</TabsContent>
				<TabsContent value={StatisticPeriod.Weekly}>
					<StatisticList period={StatisticPeriod.Weekly} />
				</TabsContent>
				<TabsContent value={StatisticPeriod.Monthly}>
					<StatisticList period={StatisticPeriod.Monthly} />
				</TabsContent>
				<TabsContent value={StatisticPeriod.All}>
					<StatisticList period={StatisticPeriod.All} />
				</TabsContent>
			</Tabs>
		</section>
	);
}

export default Page;