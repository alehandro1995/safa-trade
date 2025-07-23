"use client";
import {useState, useRef, useEffect, MouseEvent} from "react"
import { IoSettingsSharp } from "react-icons/io5";
import { currency, bank_name, payment_method } from "@prisma/client";
import { TransactionStatus, TransactionType } from "@prisma/client";
import { useDealStore } from "@/store/deal";

type DialsFilterProps = {
	currencies: currency[];
	banks: bank_name[];
	paymentMethod: payment_method[];
};

function DealsFilter({currencies, banks, paymentMethod}: DialsFilterProps) {
	const [showModal, setShowModal] = useState(false);
	const setStatus = useDealStore((state) => state.setStatus);
	const setType = useDealStore((state) => state.setType);
	const status = useDealStore((state) => state.status);
	const type = useDealStore((state) => state.type);
	
	const boxRef = useRef<HTMLDivElement>(null);
	const boxRef2 = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const elementsStatus = boxRef.current?.querySelectorAll('button');
		elementsStatus?.forEach(item => {
			if (item.getAttribute('data-status') === status) {
				item.classList.add('active');
			} else {
				item.classList.remove('active');
			}
		});

		const elementsType = boxRef2.current?.querySelectorAll('button');
		elementsType?.forEach(item => {
			if (item.getAttribute('data-type') === type) {
				item.classList.add('active');
			} else {
				item.classList.remove('active');
			}
		});
	}, []);
	
	function setActive(e: MouseEvent<HTMLButtonElement>){
		const target = e.target as HTMLButtonElement
		const status = target.getAttribute('data-status') as TransactionStatus;
		const elements = boxRef.current?.querySelectorAll('button');
		elements?.forEach(item => {
			item.classList.remove('active');
		});
	
		target.classList.add('active');
		setStatus(status);
	}
	
	function setActive2(e: MouseEvent<HTMLButtonElement>){
		const target = e.target as HTMLButtonElement
		const elements = boxRef2.current?.querySelectorAll('button');
		const type = target.getAttribute('data-type') as TransactionType;
		elements?.forEach(item => {
			item.classList.remove('active');
		});
	
		target.classList.add('active');
		setType(type);
	}
	
	return ( 
		<>
		<div className="flex items-center justify-between bg-white shadow-sm rounded-2xl p-5">
			<div>
				<div ref={boxRef} className="flex gap-x-3">
					<button onClick={setActive} data-status="PENDING" className="link-primary">Активные</button>
					<button onClick={setActive} data-status="COMPLETED" className="link-primary">Завершенные</button>
					<button onClick={setActive} data-status="CANCELED" className="link-primary">Отмененные</button>
					<button onClick={setActive} data-status="DISPUTED" className="link-primary">Споры</button>
				</div>
				<div ref={boxRef2} className="flex gap-x-3 mt-2">
					<button onClick={setActive2} data-type="RECEIVE" className="link-primary active">Прием</button>
					<button onClick={setActive2} data-type="PAYMENT" className="link-primary">Выплата</button>
					<button
						onClick={() => setShowModal(true)} 
						className="link-primary">
						<IoSettingsSharp className="text-xl" />
					</button>
				</div>
			</div>
		</div>

		</>
	);
}

export default DealsFilter;