import Link from "next/link";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getTransactionByPeriod } from "@/actions/transactionAction";
import { StatisticPeriod } from "@/types/Statistic";
import { MdFormatListBulleted } from "react-icons/md";
import { MainChart } from "@/components/MainChart";
import MainInfo from "@/components/MainInfo";
import ModalReceive from "@/components/modals/ModalReceive";
import ModalSend from "@/components/modals/ModalSend";
import MainBalance from "@/components/MainBalance";

export default async function Home() {
	const transactions = await getTransactionByPeriod(StatisticPeriod.All);

  return (
		<div className="flex flex-col container mx-auto px-5 py-10">
			<h1 className="text-3xl font-bold mb-5">Главная</h1>
			<div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-5">
				<Card>
					<CardHeader>
						<CardTitle className="text-2xl font-semibold">Баланс:</CardTitle>
					</CardHeader>
					<MainBalance />
					<div className="flex flex-col sm:flex-row sm:items-center gap-5 mt-2"> 
						<Link href="/history" className="flex w-full sm:w-fit">
							<Button variant="secondary" className="w-full sm:w-fit">
								<MdFormatListBulleted />
								<span className="text-[12px] font-semibold relative top-[2px]">История</span>
							</Button>
						</Link>
						<ModalSend />
						<ModalReceive />
					</div>
				</Card>
				<Card className="grid grid-cols-1 sm:grid-cols-2">
					<MainInfo transactions={transactions} />
				</Card>
			</div>
			<Card className="mt-5 h-full lg:h-[480px]">
				<MainChart transactions={transactions} />
			</Card>
		</div>
  );
}