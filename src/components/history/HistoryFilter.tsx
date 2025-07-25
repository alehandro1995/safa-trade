"use client";
import { useEffect, useState } from 'react';
import { ImSpinner2 } from "react-icons/im";
import { getHistoryByParams } from "@/actions/history";
import { useHistoryStore } from "@/store/history";
import { useAlertStore, AlertStatus } from '@/store/alert';
import type { IHistoryFilter } from "@/types/history";

function HistoryFilter() {
	const [visible, setVisible] = useState(false);
	const setHistory = useHistoryStore((state) => state.setHistory);
	const setTotalCount = useHistoryStore((state) => state.setTotalCount);
	const setCurrentPage = useHistoryStore((state) => state.setCurrentPage);
	const currentPage = useHistoryStore((state) => state.currentPage);
	const setHistoryFilter = useHistoryStore((state) => state.setHistoryFilter);
	const historyFilter = useHistoryStore((state) => state.historyFilter);
	const setError = useAlertStore((state) => state.show);

	const defaultFetch = () => {
		console.log("Fetching default history with filter:", historyFilter);
		setVisible(true);
		const formData = new FormData();
		formData.append("page", currentPage.toString());
		formData.append("order", historyFilter.order || "");
		formData.append("from", historyFilter.from || "");
		formData.append("to", historyFilter.to || "");
		formData.append("type", historyFilter.type || "");
		getHistoryByParams(formData)
			.then((response) => {
				const {totalCount, history} = response as IHistoryFilter;
				setHistory(history);
				setTotalCount(totalCount);
			})
			.catch((error) => {
				console.error("Error fetching initial history:", error);
				setError(AlertStatus.ERROR, "Не удалось загрузить историю транзакций. Попробуйте позже.");
			})
			.finally(() => {
				setVisible(false);
			});
	}

	useEffect(() => {
		console.log("Fetching history for page:", currentPage);
		defaultFetch();
	}, [currentPage]);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setVisible(true);
		const formData = new FormData(e.currentTarget);
		try {
			const {totalCount, history} = await getHistoryByParams(formData) as IHistoryFilter;
			const filter: Record<string, string | undefined> = {
				order: formData.get("order")?.toString(),
				from: formData.get("from")?.toString(),
				to: formData.get("to")?.toString(),
				type: formData.get("type")?.toString(),
			};
			setHistoryFilter(filter);
			setHistory(history);
			setTotalCount(totalCount);
			setCurrentPage(1); // Reset to first page on new filter
		} catch (error) {
			console.error("Error fetching history:", error);
			setError(AlertStatus.ERROR, "Не удалось загрузить историю транзакций. Попробуйте позже.");
		} finally {
			setVisible(false);
		}
	};

	//TODO: fix reset filter
	const resetFilter = () => {
		console.log("Resetting filter to default values");
		setHistoryFilter({
			order: undefined,
			from: undefined,
			to: undefined,
			type: undefined,
		});
		setCurrentPage(1);
		defaultFetch();
	};

	return ( 
		<>
		<form 
			onSubmit={handleSubmit}
			className="flex items-center justify-between bg-white shadow-sm rounded-2xl p-5">
      <div className="grid grid-cols-4 xl:grid-cols-5 gap-5">
        <input name="order" className="default-input" type="text" placeholder="Номер счёта" />
        <input name="from" className="default-input" type="date" placeholder="От даты" />
        <input name="to" className="default-input" type="date" placeholder="До даты" />
        <select
					name="type" 
					className="default-input">
          <option value="">Тип</option>
					<option value="RECEIVE">Приём</option>
					<option value="PAYMENT">Выплата</option>
        </select>
      </div>
      <div className="flex gap-x-2">
        <button type="submit" className="btn">Применить</button>
        <button onClick={resetFilter} type="reset" className="btn-secondary">Сбросить</button>
      </div>
    </form>
		{visible &&
			<div className="modal-box">
				<ImSpinner2  className="animate-spin text-8xl text-amber-50 my-auto"/>
			</div>
		}
		</>
	);
}

export default HistoryFilter;