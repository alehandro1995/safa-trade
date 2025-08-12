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
			/>
      <Card className="mt-5 p-5 min-w-[1240px]">
				<Link href="/requisites/create">
					<Button size="sm">
						<FaPlus />
						Добавить реквизиты
					</Button>
				</Link>
				<RequisitesList />
      </Card>
    </section>
  )
}