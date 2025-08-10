import {prisma} from "@/client";
import RequisitesList from "@/components/requisites/RequisitesList";
import Link from "next/link";
import { cookies } from 'next/headers';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa6";
import { SlashIcon } from "lucide-react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import AddGroupModal from "@/components/modals/AddGroupModal";
import AddDeviceModal from "@/components/modals/AddDeviceModal";
import RequisitesFilter from "@/components//requisites/RequisitesFilter";
 
export default async function Page() {
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
    <section className="p-6 overflow-auto">
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink href="/">Главная</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator>
						<SlashIcon className="h-4 w-4" />
					</BreadcrumbSeparator>
					<BreadcrumbItem>
						<BreadcrumbPage>Реквизиты</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
      <RequisitesFilter
				currencies={currencies}
				banks={banks}
				paymentMethod={paymentMethod}
				groups={groups}
			/>
      <Card className="mt-5 p-5 min-w-[1240px]">
				<div className="flex gap-5 mb-5">
					<AddDeviceModal devices={devices} />
					<AddGroupModal groups={groups} />
					<Link href="/requisites/create" className="ml-auto">
						<Button size="sm">
							<FaPlus />
							Добавить реквизиты
						</Button>
					</Link>
				</div>
				<RequisitesList />
      </Card>
    </section>
  )
}