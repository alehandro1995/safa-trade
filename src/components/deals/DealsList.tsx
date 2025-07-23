"use client";
import { useEffect, useState } from "react";
import DealsItem from "./DealsItem";
import { ITransaction } from "@/types/Transaction";
import { TransactionType, TransactionStatus } from "../../../generated/prisma";

type DealsListProps = {
	status: TransactionStatus;
	type: TransactionType;
};

function DealsList({status, type}: DealsListProps) {
  const [deals, setDeals] = useState<ITransaction[]|[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDeals = async () => {
    setLoading(true);
    const params = new URLSearchParams({ status, type });
    //if (type) params.append("type", type);
    const res = await fetch(`/api/deals?${params.toString()}`);
    const data = await res.json();
		const transactions: ITransaction[] = data.transactions || [];
		transactions.sort((a, b) => {
			const dateA = new Date(a.createdAt);
			const dateB = new Date(b.createdAt);
			return dateB.getTime() - dateA.getTime();
		});
    setDeals(transactions);
    setLoading(false);
  };

  useEffect(() => {
    fetchDeals();
  }, [status, type]);

  if (loading) {
		return (
			<div>Loading...</div>
		);
	}

  return (
		<>
    <div className="flex flex-col p-5 bg-white shadow-sm rounded-2xl mt-8 text-sm">
      <div className="grid grid-cols-6 items-end border-b-[1px] border-gray-900 p-2 font-semibold">
        <div>ID/Дата</div>
        <div>Статус</div>
        <div>Курс</div>
        <div>Сумма</div>
        <div>Реквизиты</div>
      </div>

      {deals.map((transaction, index) => (
        <DealsItem
          key={transaction.id}
          id={transaction.id}
					index={index}
          num={transaction.num}
          createdAt={transaction.createdAt}
					rate={transaction.transactionHistory[0].rate}
					amountInCurrency={transaction.transactionHistory[0].amountInCurrency}
					updatedAt={transaction.transactionHistory[0].createdAt}
          status={transaction.transactionHistory[0].transactionStatus}
          amount={transaction.amount}
          symbol={transaction.requisites.currency.symbol}
          bankName={transaction.requisites.bankName.name}
          paymentMethod={transaction.requisites.paymentMethod.name}
          cardOwner={transaction.requisites.cardOwner}
					card={transaction.requisites.card}
					setDeals={setDeals}
					deals={deals}
        />
      ))}
    </div>
		</>
  );
}

export default DealsList;
