import DealsList from "@/components/deals/DealsList";
import { SlashIcon } from "lucide-react";

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
				<TabsList className=" bg-amber-100">
					<TabsTrigger value="pending">Активные</TabsTrigger>
					<TabsTrigger value="completed">Завершенные</TabsTrigger>
					<TabsTrigger value="canceled">Отмененные</TabsTrigger>
					<TabsTrigger value="disputed">Споры</TabsTrigger>
				</TabsList>
				<TabsContent value="pending">
					<DealsList status="PENDING" type="RECEIVE" />
				</TabsContent>
				<TabsContent value="completed">
					<DealsList status="COMPLETED" type="RECEIVE" />
				</TabsContent>
				<TabsContent value="canceled">
					<DealsList status="CANCELED" type="RECEIVE" />
				</TabsContent>
				<TabsContent value="disputed">
					<DealsList status="DISPUTED" type="RECEIVE" />
				</TabsContent>
			</Tabs>
		</section>
	);
}

export default Page;