"use client";
import { useRequisitesStore } from "@/store/requisites";
import RequisiteItem from "./RequisiteItem";
import { Skeleton } from "@/components/ui/skeleton";


function RequisitesList() {
	const requisites = useRequisitesStore((state) => state.requisites);

	if (!requisites) {
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
		<div className="w-full flex flex-col">
			<div className="grid grid-cols-12 items-end border-b-[1px] border-border p-4 font-semibold">
				<div>Устройство</div>
				<div className="col-span-2">Реквизиты</div>
				<div>Группа</div>
				<div>Валюта</div>
				<div className="col-span-2">Лимиты по суммам</div>
				<div>По объему</div>
				<div>По кол.</div>
				<div>Одноврем.</div>
				<div>Статус</div>
			</div>
			{requisites.length > 0 
				? 
				requisites.map((item, index) => (
					<RequisiteItem key={item.id} item={item} index={index} />
				))
				: 
				<div className="grid grid-cols-1 p-4 text-center">Нет доступных реквизитов</div>
			}
		</div>
	);
}

export default RequisitesList;