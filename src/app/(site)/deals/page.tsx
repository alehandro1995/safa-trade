import DealsList from "@/components/deals/DealsList";
import { SlashIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
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

function Page() {
	return ( 
		<section className="p-6">
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink href="/">Главная</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator>
						<SlashIcon />
					</BreadcrumbSeparator>
					<BreadcrumbItem>
						<BreadcrumbPage>Сделки</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
			<Tabs defaultValue="pending" className="w-full mt-4">
				<TabsList className=" bg-emerald-100">
					<TabsTrigger value="pending" className="font-oswald tracking-wide cursor-pointer">Активные</TabsTrigger>
					<TabsTrigger value="completed" className="font-oswald tracking-wide cursor-pointer">Завершенные</TabsTrigger>
					<TabsTrigger value="canceled" className="font-oswald tracking-wide cursor-pointer">Отмененные</TabsTrigger>
					<TabsTrigger value="disputed" className="font-oswald tracking-wide cursor-pointer">Споры</TabsTrigger>
				</TabsList>
				<TabsContent value="pending">
					<Card className="mt-5 p-5 overflow-auto">
						<DealsList status="PENDING" type="RECEIVE" />
					</Card>
				</TabsContent>
				<TabsContent value="completed">
					<Card className="mt-5 p-5 overflow-auto">
						<DealsList status="COMPLETED" type="RECEIVE" />
					</Card>
				</TabsContent>
				<TabsContent value="canceled">
					<Card className="mt-5 p-5 overflow-auto">
						<DealsList status="CANCELED" type="RECEIVE" />
					</Card>
				</TabsContent>
				<TabsContent value="disputed">
					<Card className="mt-5 p-5 overflow-auto">
						<DealsList status="DISPUTED" type="RECEIVE" />
					</Card>
				</TabsContent>
			</Tabs>
		</section>
	);
}

export default Page;