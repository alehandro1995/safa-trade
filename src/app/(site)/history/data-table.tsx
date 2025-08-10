"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DataTablePagination from "@/components/history/DataTablePagination";

import {
  ColumnDef,
	ColumnFiltersState,
	SortingState,
  flexRender,
  getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"

import { Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns";
import { ru } from "date-fns/locale"
import { Calendar } from "@/components/ui/calendar";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const table = useReactTable({
	data,
	columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		state: {
	  	sorting,
	  	columnFilters,
		}
  });

  return (
		<div className="w-full">
			<div className="w-full flex items-center gap-4 py-4">
				<Input
          placeholder="Поиск по номеру"
          value={(table.getColumn("num")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("num")?.setFilterValue(event.target.value)
          }
          className="w-48"
        />
				<Popover>
					<PopoverTrigger asChild>
						<Button variant="outline" className="w-[200px] justify-start text-left">
							<CalendarIcon className="mr-2 h-4 w-4" />
							{selectedDate 
								? format(selectedDate, 'PP', { locale: ru }) 
								: <span className="text-muted-foreground">Выберите дату</span>}
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-auto p-0">
						<Calendar
							mode="single"
							selected={selectedDate}
							onSelect={(date: Date) => {
								const formattedDate = format(date, "dd.MM.yyyy");
								setSelectedDate(date)
								table.getColumn('updatedAt')?.setFilterValue(formattedDate)
							}}
							locale={ru}
							required
						/>
					</PopoverContent>
				</Popover>
				<Select
					value={(table.getColumn("type")?.getFilterValue() as string) ?? ""}
					onValueChange={(value) =>
					table.getColumn("type")?.setFilterValue(value)
					}
				>
					<SelectTrigger className="w-48">
						<SelectValue placeholder="Тип" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectLabel>Тип</SelectLabel>
							<SelectItem value="RECEIVE">Приём</SelectItem>
							<SelectItem value="PAYMENT">Выплата</SelectItem>
						</SelectGroup>
					</SelectContent>
				</Select>
				<Select
					value={(table.getColumn("status")?.getFilterValue() as string)}
					onValueChange={(value) =>
					table.getColumn("status")?.setFilterValue(value)
					}
				>
					<SelectTrigger className="w-48">
						<SelectValue placeholder="Статус" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectLabel>Статус</SelectLabel>
							<SelectItem value="COMPLETED">Завершенные</SelectItem>
							<SelectItem value="CANCELED">Отменённые</SelectItem>
							<SelectItem value="FAILED">Неудачные</SelectItem>
							<SelectItem value="DISPUTED">Споры</SelectItem>
						</SelectGroup>
					</SelectContent>
				</Select>
				<Button
					className="ml-auto"
					size="sm"
					onClick={() => {
						table.getColumn("type")?.setFilterValue(undefined);
						table.getColumn("status")?.setFilterValue(undefined);
          	table.getColumn('updatedAt')?.setFilterValue(undefined);
						table.getColumn("num")?.setFilterValue(undefined);
						setSelectedDate(undefined);
					}}
				>
					Сбросить фильтры
				</Button>
      </div>
			<div className="overflow-hidden rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext()
													)}
										</TableHead>
									)
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className="h-24 text-center">
									Список пуст
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<DataTablePagination table={table} />
		</div>
  )
}