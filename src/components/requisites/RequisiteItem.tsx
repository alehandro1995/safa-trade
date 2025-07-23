"use client"
import { useState } from "react";
import { useRequisitesStore } from "@/store/requisites";
import Link from "next/link";
import { toast } from "sonner";
import { FaRegTrashCan, FaPencil } from "react-icons/fa6";
import {Switch} from "../ui/switch";
import { changeStatus, deleteRequisites } from "@/actions/requisitesAction";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import type { 
	Group, 
	Device, 
	currency, 
	bank_name, 
	payment_method 
} from "../../../generated/prisma";
import { Button } from "../ui/button";

export interface Requisite {
	id: number;
	card: string;
	cardOwner: string;
	cardNumber: string;
	minOrder: number | null;
	maxOrder: number | null;
	dayLimit: number | null;
	monthLimit: number | null;
	dayQuantity: number | null;
	monthQuantity: number | null;
	concurrentOrder: number | null;
	minutesDelay: number | null;
	status: boolean;
	device?: Device | null;
	group?: Group | null;
	currency: currency;
	bankName: bank_name;
	paymentMethod: payment_method;
}

function RequisiteItem({ item, index }: { item: Requisite; index: number }) {
	const [isActive, setIsActive] = useState(item.status);
	const removeRequisite = useRequisitesStore((state) => state.removeRequisite);

	const handleSwitchChange = (checked: boolean) => {
		changeStatus(item.id, checked)
			.then(() => {
				setIsActive(checked);
			})
			.catch((error) => {
				toast.error(error.message || 'Ошибка при изменении статуса');
			});
	}

	const handleDelete = (id: number) => {
		deleteRequisites(id)
			.then(() => {
				removeRequisite(id);
				toast.success('Реквизиты успешно удалены');
			})
			.catch((error) => {
				toast.error(error.message || 'Ошибка при удалении реквизитов');
			});
	}
	
	return ( 
		<div 
			className={`grid grid-cols-12 items-center justify-center p-4 ${index % 2 !== 0 ? "bg-transparent" : "bg-emerald-100"}`}>
				<div className="flex flex-col">
					{item?.device
						? 
						<>
							<span>{item.device.name}</span>
							<span className="text-green-700 text-[12px] font-semibold">{item.device.deviceId.substr(0, 8)}</span>
						</>
						: "n/a"
					}
				</div>
				<div className="flex flex-col col-span-2">
					<span className="font-semibold ellipsis text-sm">
						{item?.bankName.name} - {item?.paymentMethod.name}
					</span>
					<span className="font-semibold ellipsis pr-2">{item.card}</span>
					<span className="text-green-700 text-[12px]">{item.cardOwner}</span>
				</div>
				<div>
					{item.group ? item.group.name : "n/a"}	
				</div>
				<div>{item.currency.symbol}</div>
				<div className="flex flex-col col-span-2">
					<span>{item.minOrder ? "от " + item.minOrder + " " + item.currency.symbol : "---"}</span>
					<span>{item.maxOrder ? "до " + item.maxOrder + " " + item.currency.symbol : "---"}</span>
				</div>
				<div>
					<div className="p-2 bg-popover rounded-md text-xs flex w-fit gap-x-1">
						<span>{item.dayLimit ? item.dayLimit : "---"}</span> \ <span>{item.monthLimit ? item.monthLimit : "---"}</span>
					</div>
				</div>
				<div>
					<div className="p-2 bg-popover rounded-md text-xs flex w-fit gap-x-1">
						<span>{item.dayQuantity ? item.dayQuantity : "---"}</span> \ <span>{item.monthQuantity ? item.monthQuantity : "---"}</span>
					</div>
				</div>
				<div>
					{item.concurrentOrder ? item.concurrentOrder : "---"}
				</div>
				<div>
					<Switch checked={isActive} onCheckedChange={handleSwitchChange} />
				</div>
				<div className="flex gap-x-2 justify-end">
					<Link href={`/requisites/update/${item.id}`}>
						<Button variant="outline">
							<FaPencil />
						</Button>
					</Link>
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button variant="outline" className="text-destructive">
								<FaRegTrashCan />
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Вы уверены что хотите удалить?</AlertDialogTitle>
								<AlertDialogDescription>
									Это действие нельзя отменить. Оно навсегда удалит реквизиты {item.card} - {item.cardOwner}.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Отмена</AlertDialogCancel>
								<AlertDialogAction onClick={() => handleDelete(item.id)}>Удалить</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>
		</div>
	);
}

export default RequisiteItem;