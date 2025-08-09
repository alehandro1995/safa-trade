"use client"
import { Badge } from "@/components/ui/badge"
import { ColumnDef } from "@tanstack/react-table"
import { HiOutlineArrowCircleDown, HiOutlineArrowCircleUp } from "react-icons/hi";
import HistoryPopover from "@/components/history/HistoryPopover";
import type { HistoryColumns } from "@/types/History"
import { BsList } from "react-icons/bs";
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react";
import { format } from "date-fns";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"

export const columns: ColumnDef<HistoryColumns>[] = [
	{
		accessorKey: "num",
		header: "Номер",
	},
  {
    accessorKey: "updatedAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Дата
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
		cell: ({ row }) => format(new Date(row.getValue("updatedAt")), "dd.MM.yyyy"),
		filterFn: (row, columnId, filterValue) => {
			const value = format(new Date(row.getValue(columnId)), "dd.MM.yyyy");
			return (value === filterValue) || (filterValue === "");
		},
	},
  {
    accessorKey: "amount",
    header: "Сумма",
		cell: ({ row }) => {
			const amount = row.getValue("amount") as number;
			return amount.toLocaleString("en-US", {
				style: "currency",
				currency: "USD",
			});
		},
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
    id: "actions",
    cell: ({ row }) => {
			
      const {id} = row.original;

			if (!id) {
				throw new Error("Transaction not found");
			}

      return (
				<div className="w-full flex items-center justify-end pr-5">
					<Popover>
						<PopoverTrigger asChild>
							<Button
								size="sm"
								variant="outline"	
								className="w-fit ml-auto">
								<BsList className="text-2xl text-foreground" />		
							</Button>
						</PopoverTrigger>
						<PopoverContent 
							side="left"
							align="end"
							avoidCollisions={true}
							className="w-[600px]"
							>
							<HistoryPopover id={id} />
						</PopoverContent>
					</Popover>
				</div>
      )
    },
  },
]