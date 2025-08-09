"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { HiOutlineArrowDownCircle } from "react-icons/hi2";
import { MdOutlineFileCopy, MdFileCopy } from "react-icons/md";
import { BsList } from "react-icons/bs";
import { completeTransaction } from "@/actions/transactionAction";
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
	setDeals: React.Dispatch<React.SetStateAction<ITransaction[] | null>>;
};

function DealsItem({transaction, index, deals, setDeals} : DealsItemProps) {
	const router = useRouter();
	const [pending, setPending] = useState(false);
	const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(transaction.num);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

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

	return ( 
		<div className={`grid grid-cols-6 items-center p-2 ${index % 2 !== 0 ? "bg-transparent" : "bg-emerald-100"}`}>
			<div className="flex items-center gap-x-1">
				<HiOutlineArrowDownCircle className="text-green-700 text-lg" />
				<div>
					<div className="flex items-center gap-x-2 relative">
						<span>{transaction.num}</span>
						{copied && <div className="absolute -top-4 right-12 text-[10px] text-yellow-500">Скопировано</div>}
						{!copied 
							?
							<MdOutlineFileCopy onClick={copyToClipboard} className="text-[16px] text-green-700/90 hover:text-green-700 cursor-pointer"/>
							:
							<MdFileCopy onClick={copyToClipboard} className="text-[16px] text-green-700/90 hover:text-green-700 cursor-pointer"/>
						}
					</div>
					<p className="text-green-700 text-xs">{new Date(transaction.createdAt).toLocaleString()}</p>
				</div>
			</div>
			<div>
				<p>{transaction.status.toUpperCase()}</p>
				<p className="text-green-700 text-xs">{new Date(transaction.updatedAt).toLocaleString()}</p>
			</div>
			<div className="text-lg font-semibold">{transaction.rate}</div>
			<div>
				<p className="text-lg font-semibold">{transaction.amount} {transaction.requisites.currency.symbol}</p>
				<p className="text-green-700 text-xs">{transaction.amountInCurrency.toFixed(4)} USDT</p>
			</div>
			<div className="flex flex-col">
				<span className="font-semibold text-xs pr-2">
					{transaction.requisites.bankName.name} - {transaction.requisites.paymentMethod.name}
				</span>
				<span className="font-bold">{transaction.requisites.card}</span>
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
						<div className="w-full grid grid-cols-2 p-2">
							<div className="font-semibold">ID</div>
							<div>{transaction.num}</div>
						</div>
						<div className="w-full grid grid-cols-2 bg-emerald-100 p-2">
							<div className="font-semibold">Инициатор</div>
							<div>{transaction.initiator}</div>
						</div>
						<div className="w-full grid grid-cols-2 p-2">
							<div className="font-semibold">Тип</div>
							<div>{transaction.type}</div>
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
							<div>{transaction.rate}</div>
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
								{transaction.amountInCurrency.toFixed(4)} USDT
							</div>
						</div>
						<div className="w-full grid grid-cols-2 p-2">
							<div className="font-semibold">Сумма вознаграждения</div>
							<div className={`text-green-800 font-semibold ${transaction.status === "CANCELED" && "line-through"}`}>
								{transaction.status === "COMPLETED" && '+'}
								{transaction.amountInCurrencyFee.toFixed(4)} USDT
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
					</PopoverContent>
				</Popover>
			}	
		</div>
	);
}

export default DealsItem;