"use client";
import HistoryItem from "./HistoryItem";
import { useModalStore, ModalTypes } from "@/store/modal";
import { useHistoryStore } from "@/store/history";
import TransactionDetail from "./modals/TransactionDetail";

function HistoryList() {
	const modalType = useModalStore((state) => state.type);
	const modalOpen = useModalStore((state) => state.isVisible);
	const history = useHistoryStore((state) => state.history);
	
	return ( 
		<>
		<div className="flex flex-col p-5 bg-white shadow-sm rounded-2xl mt-8 text-sm">
        <div className="grid grid-cols-7 items-end border-b-[1px] border-gray-900 p-2 font-semibold">
          <div>Дата</div>
          <div>Валюта</div>
          <div>Сумма</div>
          <div>Тип</div>
          <div>Баланс до</div>
          <div>Баланс после</div>
					<div></div>
        </div>
				{history.length > 0 && history.map((transaction, index) => {
					return (
						<HistoryItem 
							key={transaction.id}
							id={transaction.id}
							index={index}
							createdAt={transaction.createdAt}
							type={transaction.type}
							currency={transaction.requisites.currency.symbol}
							amount={transaction.amount}
							balanceBefore={transaction.balanceBefore}
							balanceAfter={transaction.balanceAfter}
						/>
					);
				})}
        <div className="h-5"></div>
    </div>
		{modalOpen && modalType === ModalTypes.TRANSACTION_DETAIL && <TransactionDetail />}
		</>
	);
}

export default HistoryList;