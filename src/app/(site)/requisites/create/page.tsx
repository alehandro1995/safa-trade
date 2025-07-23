import { prisma } from "@/client";
import RequisitesForm from "@/components//requisites/RequisitesForm";
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

async function Page() {
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
				requisites={null}
				type="create"
				/>
		</div>
	);
}

export default Page;