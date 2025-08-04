import { prisma } from "@/client"; 
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { cookies } from "next/headers";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import type { HistoryColumns } from "@/types/History";

async function getData(id:number): Promise<HistoryColumns[]> {
	const data = await prisma.transaction.findMany({
		where: { 
			userId: id,
			NOT: { status: "PENDING" } 
		},
		select: {
			id: true,
			createdAt: true,
			amount: true,
			status: true,
			type: true,
			requisites: {
				select: {
					currency: {
						select: {
							symbol: true,
						},
					},
				},
			},
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	return data.map((item) => ({
		id: item.id,
		createdAt: item.createdAt,
		amount: `${item.amount} ${item.requisites.currency.symbol}`,
		type: item.type,
		status: item.status,
	}));
}

async function Page() {
	const cookie = await  cookies();
	const email = cookie.get("email")?.value || "";
	if (!email) {
		throw new Error("Email cookie not found");
	}

	const user = await prisma.user.findUnique({
		where: { email },
		select: {
			id: true,
		},
	});

	if (!user) {
		throw new Error("User not found");
	}
	
	const data = await getData(user.id);

	return ( 
		<section className="p-6">
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink href="/">Главная</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator>/</BreadcrumbSeparator>
					<BreadcrumbItem>
						<BreadcrumbPage>История</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
			<div className="py-10 overflow-auto">
      	<DataTable columns={columns} data={data} />
    	</div>
		</section>
	);
}

export default Page;