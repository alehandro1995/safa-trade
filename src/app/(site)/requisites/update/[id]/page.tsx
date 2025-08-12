import { prisma } from "@/client";
import RequisitesForm from "@/components/requisites/RequisitesForm";
import { cookies } from 'next/headers';
import { SlashIcon } from "lucide-react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";


async function Page({params}: {params: Promise<{id: string}>}) {
	const { id } = await params;
	const cookie = await cookies();
	const email = cookie.get('email')?.value;
	const user = await prisma.user.findUnique({
		where: {
			email: email
		}
	});
	
	if (!user) {
		throw new Error('User not found');
	}

	const currencies = await prisma.currency.findMany();
	const banks = await prisma.bank_name.findMany();
	const paymentMethod = await prisma.payment_method.findMany();
	
	const groups = await prisma.group.findMany({
		where: {
			userId: user.id
		}
	});
	
	const devices = await prisma.device.findMany({
		where: {
			userId: user.id
		}
	});

	const rawRequisite = await prisma.requisites.findUnique({
		select:{
			id: true,
			userId: true,
			currencyId: true,
			bankId: true,
			paymentId: true,
			cardNumber: true,
			cardOwner: true,
			card: true,
			minOrder: true,
			maxOrder: true,
			dayLimit: true,
			monthLimit: true,
			dayQuantity: true,
			monthQuantity: true,
			concurrentOrder: true,
			minutesDelay: true,
		},
		where: {
			id: Number(id)
		}
	});

	const requisite = rawRequisite
		? {
			...rawRequisite,
			minOrder: rawRequisite.minOrder === null ? undefined : rawRequisite.minOrder,
			maxOrder: rawRequisite.maxOrder === null ? undefined : rawRequisite.maxOrder,
			dayLimit: rawRequisite.dayLimit === null ? undefined : rawRequisite.dayLimit,
			monthLimit: rawRequisite.monthLimit === null ? undefined : rawRequisite.monthLimit,
			dayQuantity: rawRequisite.dayQuantity === null ? undefined : rawRequisite.dayQuantity,
			monthQuantity: rawRequisite.monthQuantity === null ? undefined : rawRequisite.monthQuantity,
			concurrentOrder: rawRequisite.concurrentOrder === null ? undefined : rawRequisite.concurrentOrder,
			minutesDelay: rawRequisite.minutesDelay === null ? undefined : rawRequisite.minutesDelay,
		}
		: null;

	return ( 
		<div className="container mx-auto p-6">
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink href="/">Главная</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator>
						<SlashIcon className="h-4 w-4" />
					</BreadcrumbSeparator>
					<BreadcrumbItem>
						<BreadcrumbLink href="/requisites">Реквизиты</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator>
						<SlashIcon className="h-4 w-4" />
					</BreadcrumbSeparator>
					<BreadcrumbItem>
						<BreadcrumbPage>Создать</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
			<RequisitesForm 
				currencies={currencies} 
				banks={banks} 
				paymentMethod={paymentMethod} 
				groups={groups} 
				devices={devices}
				requisites={requisite}
				type="update"
			/>
		</div>
	);
}

export default Page;