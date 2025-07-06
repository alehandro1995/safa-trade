import Image from "next/image";
import Link from "next/link";
import ModalReceive from "@/components/ModalReceive";
import ModalSend from "@/components/ModalSend";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MyChart } from "@/components/MyChart";

import { MdFormatListBulleted } from "react-icons/md";
import { 
	IoCard, 
	IoCash, 
	IoTrendingUp, 
	IoAnalyticsOutline 
} from "react-icons/io5";


export default function Home() {
  return (
		<div className="w-full flex flex-col p-5">
			<h1 className="text-3xl font-bold mb-5">Главная</h1>
			<div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-5">
				<Card>
					<CardHeader>
						<CardTitle className="text-2xl font-semibold">Баланс:</CardTitle>
					</CardHeader>
					<div className="flex items-center gap-x-3">
						<Image src="/tether.png" width={50} height={50} alt="Tether"/>
						<div>
							<h4 className="text-xl font-semibold">0.00000000 USDT</h4>
							<h4 className="text-sm text-red-500">Страховой лимит: 0.00000000 USDT</h4>
							<h4 className="text-sm text-blue-600">Заблокировано: 0.00000000 USDT</h4>
						</div>
					</div>
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
				<Card className="grid grid-cols-1 sm:grid-cols-2 gap-5">
					<div className="bg-green-700 p-5 rounded-lg text-emerald-100 flex items-center justify-between">
						<div>
							<h4 className="text-lg font-semibold">Оборот</h4>
							<h5 className="text-3xl font-extrabold">40 000$</h5>
						</div>
						<div className="w-12 h-12 flex items-center justify-center bg-green-800 rounded-full">
							<IoCard className="text-emerald-100 text-3xl" />
						</div>
					</div>
					<div className="bg-green-700 p-5 rounded-lg text-emerald-100 flex items-center justify-between">
						<div>
							<h4 className="text-lg font-semibold">Доход</h4>
							<h5 className="text-3xl font-extrabold">5 000$</h5>
						</div>
						<div className="w-12 h-12 flex items-center justify-center bg-green-800 rounded-full">
							<IoCash className="text-emerald-100 text-3xl" />
						</div>
					</div>
					<div className="bg-green-700 p-5 rounded-lg text-emerald-100 flex items-center justify-between">
						<div>
							<h4 className="text-lg font-semibold">Сделки</h4>
							<h5 className="text-3xl font-extrabold">600</h5>
						</div>
						<div className="w-12 h-12 flex items-center justify-center bg-green-800 rounded-full">
							<IoTrendingUp className="text-emerald-100 text-3xl" />
						</div>
					</div>
					<div className="bg-green-700 p-5 rounded-lg text-emerald-100 flex items-center justify-between">
						<div>
							<h4 className="text-lg font-semibold">Конверсия</h4>
							<h5 className="text-3xl font-extrabold">68%</h5>
						</div>
						<div className="w-12 h-12 flex items-center justify-center bg-green-800 rounded-full">
							<IoAnalyticsOutline className="text-emerald-100 text-3xl" />
						</div>
					</div>
				</Card>
			</div>
			<Card className="mt-5 h-full lg:h-[480px]">
				<MyChart />
			</Card>
		</div>
  );
}
