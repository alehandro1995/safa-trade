"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { HiOutlineArrowDownCircle } from "react-icons/hi2";
import { BsList } from "react-icons/bs";
import { completeTransaction } from "@/actions/transaction";
import { ITransaction } from "@/types/Transaction";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type DealsItemProps = {
	transaction: ITransaction;
	index: number;
	deals: ITransaction[];
	setDeals: React.Dispatch<React.SetStateAction<ITransaction[]>>;
};

function DealsItem({transaction, index, deals, setDeals} : DealsItemProps) {
	const [pending, setPending] = useState(false);
	const router = useRouter();
	const changeStatus = async (id: number) => {
		setPending(true);
		completeTransaction(id)
			.then(() => {
				const newDeals = deals.filter((deal) => deal.id !== id);
				setDeals(newDeals);
				router.refresh();
				toast.success("Сделка успешно подтверждена");
			})
			.catch((error) => {
				console.error("Ошибка при подтверждении сделки:", error);
				toast.error("Произошла ошибка при подтверждении сделки. Пожалуйста, попробуйте позже.");
			})
			.finally(() => {
				setPending(false);
			});
	}

	const rate = transaction.transactionHistory[0]?.rate || 0 as number;
	const amountInCurrency = Number(transaction.transactionHistory[0]?.amountInCurrency) || 0;
	const updatedAt = transaction.transactionHistory[0]?.createdAt || ''

	return ( 
		<div className={`grid grid-cols-6 items-center p-2 ${index % 2 !== 0 ? "bg-transparent" : "bg-emerald-100"}`}>
			<div className="flex items-center gap-x-1">
				<HiOutlineArrowDownCircle className="text-green-700 text-lg" />
				<div>
					<p>{transaction.num}</p>
					<p className="text-green-700 text-xs">{new Date(transaction.createdAt).toLocaleString()}</p>
				</div>
			</div>
			<div>
				<p>{transaction.status.toUpperCase()}</p>
				<p className="text-green-700 text-xs">{new Date(updatedAt).toLocaleString()}</p>
			</div>
			<div className="text-lg font-semibold">{rate}</div>
			<div>
				<p className="text-lg font-semibold">{transaction.amount} {transaction.requisites.currency.symbol}</p>
				<p className="text-green-700 text-xs">{amountInCurrency.toFixed(6)} USDT</p>
			</div>
			<div className="flex flex-col">
				<span className="font-semibold ellipsis pr-2">
					{transaction.requisites.bankName.name} - {transaction.requisites.paymentMethod.name}
				</span>
				<span className="text-xs">{transaction.requisites.card}</span>
				<span className="text-green-700 text-[12px]">{transaction.requisites.cardOwner}</span>
			</div>
			{ transaction.status === "PENDING" 
				? 
				<Button 
					onClick={() => changeStatus(transaction.id)}
					size="sm"
					variant="outline"
					className="w-fit ml-auto"
				>
					Подтвердить
				</Button>
				:
				<Popover>
					<PopoverTrigger asChild>
						<Button
							disabled={pending}
							size="sm"
							variant="outline"	
							className="w-fit ml-auto">
							<BsList className="text-2xl text-foreground" />		
						</Button>
					</PopoverTrigger>
					<PopoverContent 
						side="left"
						align="end"
						avoidCollisions={true}
						className="w-[600px]"
					>
					<h4 className="text-lg font-semibold text-center mb-2">Торговая сделка</h4>			
					<div className="w-full flex flex-col text-sm px-2">
						<div className="w-full grid grid-cols-2 bg-emerald-100 p-2">
							<div className="font-semibold">ID</div>
							<div>{transaction.num}</div>
						</div>
						<div className="w-full grid grid-cols-2 p-2">
							<div className="font-semibold">Тип</div>
							<div>Приём</div>
						</div>
						<div className="w-full grid grid-cols-2 bg-emerald-100 p-2">
							<div className="font-semibold">Дата</div>
							<div>{new Date(transaction.createdAt).toLocaleString()}</div>
						</div>
						<div className="w-full grid grid-cols-2 p-2">
							<div className="font-semibold">Статус</div>
							<div>{transaction.status}</div>
						</div>
						<div className="w-full grid grid-cols-2 bg-emerald-100 p-2">
							<div className="font-semibold">Курс</div>
							<div>{transaction.transactionHistory[0].rate}</div>
						</div>
						<div className="w-full grid grid-cols-2 p-2">
							<div className="font-semibold">Сумма поступлений</div>
							<div>{transaction.amount} {transaction.requisites.currency.symbol}</div>
						</div>
						<div className="w-full grid grid-cols-2 bg-emerald-100 p-2">
							<div className="font-semibold">Сумма сделки</div>
							<div className={`${transaction.status === "COMPLETED" ? "text-green-800" : "text-red-800"} font-semibold`}>
								{transaction.status === "COMPLETED" && '-'}
								{transaction.status === "CANCELED" && '+'}
								{transaction.transactionHistory[0].amountInCurrency.toFixed(6)} USDT
							</div>
						</div>
						<div className="w-full grid grid-cols-2 p-2">
							<div className="font-semibold">Сумма вознаграждения</div>
							<div className={`text-green-800 font-semibold ${transaction.status === "CANCELED" && "line-through"}`}>
								{transaction.status === "COMPLETED" && '+'}
								{transaction.transactionHistory[0].amountInCurrencyFee.toFixed(4)} USDT
							</div>
						</div>
						<div className="w-full grid grid-cols-2 bg-emerald-100 p-2">
							<div className="font-semibold">Реквизиты</div>
							<div>
								<p>{transaction.requisites.card}</p>
								<p className="text-green-700 text-xs">{transaction.requisites.cardOwner}</p>
							</div>
						</div>
					</div>
					<h4 className="font-semibold text-center my-2">История</h4>
					<div className="w-full  flex flex-col px-2">
						<div className="w-full grid grid-cols-3 gap-2 border-b border-border font-semibold p-2">
							<div>Дата</div>
							<div>Статус</div>
							<div>Инициатор</div>
						</div>
						{transaction.transactionHistory.length !== 0 && [...transaction.transactionHistory]
							.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
							.map((history, index) => (
								<div
									key={index}
									className={`w-full grid grid-cols-3 gap-2 p-2 text-sm ${index % 2 === 0 ? "bg-emerald-100" : ""}`}>
									<div>{new Date(history.createdAt).toLocaleString()}</div>
									<div>{history.transactionStatus}</div>
									<div>{history.initiator}</div>
								</div>
						))}
					</div>
					</PopoverContent>
				</Popover>
			}	
		</div>
	);
}

export default DealsItem;