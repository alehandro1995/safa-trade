"use client";
import { HiOutlineArrowDownCircle } from "react-icons/hi2";
import { BsList } from "react-icons/bs";
import { changeTransactionStatus } from "@/actions/transaction";
import { ITransaction } from "@/types/Transaction";


type DealsItemProps = {
	id: number;
	index: number;
	num: string;
	createdAt: Date;
	rate: number, 
	amountInCurrency: number, 
	amountInCurrencyFee?: number,
	updatedAt: Date;
	status: string;
	amount: number;
	symbol: string;
	bankName: string;
	paymentMethod: string;
	cardOwner: string;
	card: string;
	deals: ITransaction[];
	setDeals: React.Dispatch<React.SetStateAction<ITransaction[]>>;
};

function DealsItem({
	id, index, num, createdAt, rate, amountInCurrency, updatedAt, status, amount, symbol, 
	bankName, paymentMethod, cardOwner, card, deals, setDeals 
} : DealsItemProps) {

	const changeStatus = async (id: number) => {
		try {
			await changeTransactionStatus(id);	
			const newDeals = deals.filter((deal) => deal.id !== id);
			setDeals(newDeals);
		} catch (e) {
			console.error("Error changing transaction status:", e);
		}
	}

	return ( 
		<div  
			className={`grid grid-cols-6 items-center p-2 
			${index % 2 === 0 ? 'bg-gray-100' : ''}`}>
			<div className="flex items-center gap-x-1">
				<HiOutlineArrowDownCircle className="text-blue-600 text-lg" />
				<div>
					<p>{num}</p>
					<p className="text-gray-400 text-xs">{new Date(createdAt).toLocaleString()}</p>
				</div>
			</div>
			<div>
				<p>{status.toUpperCase()}</p>
				<p className="text-gray-400 text-xs">{new Date(updatedAt).toLocaleString()}</p>
			</div>
			<div className="text-lg font-semibold">{rate}</div>
			<div>
				<p className="text-lg font-semibold">{amount} {symbol}</p>
				<p className="text-gray-400 text-xs">{amountInCurrency.toFixed(6)} USDT</p>
			</div>
			<div className="flex flex-col">
				<span className="font-semibold ellipsis pr-2">
					{bankName} - {paymentMethod}
				</span>
				<span className="text-xs">{card}</span>
				<span className="text-gray-400 text-[12px]">{cardOwner}</span>
			</div>
			{ status === "PENDING" 
				? 
				<button 
					onClick={() => changeStatus(id)}
					className="btn-secondary ml-auto">
					Подтвердить
				</button>
				:
				<button 
					onClick={() => alert("Transaction details for ID: " + id)}		
					className="btn-secondary ml-auto">
					<BsList className="text-2xl" />		
				</button>
			}	
		</div>
	);
}

export default DealsItem;