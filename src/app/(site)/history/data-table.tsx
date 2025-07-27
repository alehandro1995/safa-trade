"use client"
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import DataTablePagination from "@/components/history/DataTablePagination";
import FromDate from "@/components/history/FromDate";
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
	const [fromDate, setFromDate] = useState<Date>();
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
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
    },
		globalFilterFn: 'auto',
		filterFns: {
			dateFrom: (row, columnId, filterValue: Date | undefined) => {
				if (!filterValue) return true
				const rowDate = new Date(row.getValue(columnId))
				return rowDate >= filterValue
			}
		},
  });

	useEffect(() => {
		table.getColumn("createdAt")?.setFilterValue(fromDate)
	}, [fromDate]);

  return (
		<div className="min-w-[1280px]">
			<div className="flex items-center gap-4 py-4">
				<FromDate value={fromDate} onChange={setFromDate} />
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
						table.getColumn("type")?.setFilterValue("");
						table.getColumn("status")?.setFilterValue("");
						setFromDate(undefined);
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