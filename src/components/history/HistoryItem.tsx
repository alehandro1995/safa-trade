"use client";
import { BsList } from "react-icons/bs";
import { useModalStore, ModalTypes } from "@/store/modal";

type HistoryItemProps = {
	id: number;
	index: number;
	createdAt: Date;
	type: string;
	currency: string;
	amount: number;
	balanceBefore: number;
	balanceAfter: number;
}

function HistoryItem(
	{id, index, createdAt, type, currency, amount, balanceBefore, balanceAfter}
	: HistoryItemProps) {
	const show = useModalStore((state) => state.show);

	return ( 
		<div className={`grid grid-cols-7 items-center p-2 ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}>
			<div className="text-gray-500">{new Date(createdAt).toLocaleString()}</div>
			<div className="text-gray-500">{currency}</div>
			<div className="text-gray-500">{amount}</div>
			<div className="text-gray-500">{type}</div>
			<div className="text-gray-500">{balanceBefore.toFixed(6)}</div>
			<div className="text-gray-500">{balanceAfter.toFixed(6)}</div>
			<div>
				<button 
					onClick={() => show(ModalTypes.TRANSACTION_DETAIL, {transactionId:id})}		
					className="btn-secondary ml-auto">
					<BsList className="text-2xl" />		
				</button>
			</div>
		</div>
	);
}

export default HistoryItem;