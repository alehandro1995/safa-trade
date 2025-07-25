"use client"
import { Badge } from "@/components/ui/badge"
import { ColumnDef } from "@tanstack/react-table"
import { HiOutlineArrowCircleDown, HiOutlineArrowCircleUp } from "react-icons/hi";

import type { HistoryColumns } from "@/types/History"

export const columns: ColumnDef<HistoryColumns>[] = [
  {
    accessorKey: "createdAt",
    header: "Дата",
		cell: ({ row }) => {
			const date = new Date(row.getValue("createdAt"));
			return date.toLocaleDateString("ru-RU", {
				year: "numeric",
				month: "2-digit",
				day: "2-digit",
				hour: "2-digit",
				minute: "2-digit",
			});
		},
  },
  {
    accessorKey: "amount",
    header: "Сумма",
  },
	{
		accessorKey: "type",
		header: "Тип",
		cell: ({ row }) => {
			const type = row.getValue("type") as string;
			return <Badge variant="outline">
				{type === "RECEIVE" 
					? <HiOutlineArrowCircleDown className="text-emerald-700" />
					: <HiOutlineArrowCircleUp className="text-green-700" />
				}
				{type === "RECEIVE" ? "Приём" : "Выплата"}
			</Badge>;
		},
	},
	{
		accessorKey: "status",
		header: "Статус",
		cell: ({ row }) => {
			const status = row.getValue("status") as string;
			return <Badge variant={status === "COMPLETED" ? "secondary" : "destructive"}>{status}</Badge>;
		},
	},
	{
		accessorKey: "balanceBefore",
		header: "Баланс до",
		cell: ({ row }) => {
			const balance = row.getValue("balanceBefore") as number;
			return `${balance.toFixed(6)} USDT`;
		},
	},
	{
		accessorKey: "balanceAfter",
		header: "Баланс после",
		cell: ({ row }) => {
			const balance = row.getValue("balanceAfter") as number;
			return `${balance.toFixed(6)} USDT`;
		},
	},
]