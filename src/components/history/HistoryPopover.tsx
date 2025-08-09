
"use client";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getTransactionById } from "@/actions/transactionAction";
import type { HistoryTransaction } from "@/types/History";

function HistoryPopover({id}: {id: number}) {
	const [transaction, setTransaction] = useState<HistoryTransaction | null>(null);

	useEffect(() => {
		getTransactionById(id)
			.then(fetchedTransaction => {
				setTransaction(fetchedTransaction);
				console.log("Fetched transaction:", fetchedTransaction);
			})
			.catch(error => {
				console.error("Error fetching transaction:", error);
				setTransaction(null);
			});

			return () => {
				setTransaction(null);
			};
	}, [id]);

	if (!transaction) {
		return <div className="flex flex-col w-full h-[380px] gap-5 p-6">
			{Array.from({ length: 8 }).map((_, idx) => (
				<Skeleton key={idx} className="w-full h-6" />
			))}
		</div>;
	}

	return ( 
		<>
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
					<div>{new Date(transaction.updatedAt).toLocaleString("ru-RU")}</div>
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
						{transaction.amountInCurrency?.toFixed(6)} USDT
					</div>
				</div>
				<div className="w-full grid grid-cols-2 p-2">
					<div className="font-semibold">Сумма вознаграждения</div>
					<div className={`text-green-800 font-semibold ${transaction.status === "CANCELED" && "line-through"}`}>
						{transaction.status === "COMPLETED" && '+'}
						{transaction.amountInCurrencyFee?.toFixed(4)} USDT
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
		</>
	);
}

export default HistoryPopover;