"use client";
import { useEffect, useState } from "react";
import DealsItem from "./DealsItem";
import { Skeleton } from "@/components/ui/skeleton";
import { ITransaction } from "@/types/Transaction";
import { 
	TransactionType, 
	TransactionStatus 
} from "@/generated/prisma";

type DealsListProps = {
	status: TransactionStatus;
	type: TransactionType;
};

function DealsList({status, type}: DealsListProps) {
  const [deals, setDeals] = useState<ITransaction[]|null>(null);

  const fetchDeals = async () => {
    const params = new URLSearchParams({ status, type });
    
		try{
			const res = await fetch(`/api/deals?${params.toString()}`);
			const data = await res.json();
			const transactions: ITransaction[] = data.transactions || [];
			transactions.sort((a, b) => {
				const dateA = new Date(a.createdAt);
				const dateB = new Date(b.createdAt);
				return dateB.getTime() - dateA.getTime();
			});
			setDeals(transactions);
		} catch (error) {
			console.error("Error fetching deals:", error);
			setDeals([]);
		}
  };

  useEffect(() => {
    fetchDeals();
  }, [status, type]);

  if (deals === null) {
		return (
			<div className="flex flex-col gap-y-5 w-full">
				<Skeleton className="h-12 w-full" />
				<Skeleton className="h-12 w-full" />
				<Skeleton className="h-12 w-full" />
				<Skeleton className="h-12 w-full" />
			</div>
		);
	}

  return (
    <div className="flex flex-col min-w-[1280px]">
      <div className="grid grid-cols-6 items-end border-b-[1px] border-border p-2 font-semibold">
        <div>ID/Дата</div>
        <div>Статус</div>
        <div>Курс</div>
        <div>Сумма</div>
        <div>Реквизиты</div>
      </div>

      {deals.length === 0 
				? 
				<div className="w-full text-center mt-4">Список пуст</div>
				:
				deals.map((transaction, index) => (
					<DealsItem 
						key={transaction.id} 
						index={index} 
						transaction={transaction}
						deals={deals}
						setDeals={setDeals}
					/>
				))
			}
    </div>
  );
}

export default DealsList;
