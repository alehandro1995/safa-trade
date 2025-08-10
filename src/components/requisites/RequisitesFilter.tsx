"use client";
import { useEffect, useState } from "react";
import { useRequisitesStore } from "@/store/requisites";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { getRequisites } from "@/actions/requisitesAction";
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form";

import type { IRequisites, IRequisitesFilter } from "@/types/Requisites";
import type { 
	currency, 
	bank_name, 
	payment_method, 
	Group 
} from "@/generated/prisma";

type RequisitesFilterProps = {
  currencies: currency[];
  banks: bank_name[];
  paymentMethod: payment_method[];
  groups: Group[];
}

const requisitesSchema = z.object({
  currencyId: z.number().optional(),
	bankId: z.number().optional(),
  paymentId: z.number().optional(),
	status: z.number().optional(),
  groupId: z.number().optional(),
});

function RequisitesFilter(
	{ currencies, banks, paymentMethod, groups }: RequisitesFilterProps) {
	const [pending, setPending] = useState(false);
	const addRequisite = useRequisitesStore((state) => state.addRequisite);
	const form = useForm<z.infer<typeof requisitesSchema>>({
		resolver: zodResolver(requisitesSchema),
		defaultValues:{
			currencyId: undefined,
			bankId: undefined,
			paymentId: undefined,
			status: undefined,
			groupId: undefined,
		}
	});

	useEffect(() => {
		defaultValues();
	}, []);

	function defaultValues() {
		setPending(true);
		const values:IRequisitesFilter = {
			currencyId: undefined,
			bankId: undefined,
			paymentId: undefined,
			status: undefined,
			groupId: undefined,
		};
		getRequisites(values)
			.then((data:IRequisites[]) => {
				console.log('Filtered requisites:', data);
				addRequisite(data);
			})
			.catch((error) => {
				console.error('Error fetching requisites:', error);
			})
			.finally(() => {
				setPending(false);
			});
	}

	const resetForm = () => {
		defaultValues();
		form.reset({
			currencyId: undefined,
			bankId: undefined,
			paymentId: undefined,
			status: undefined,
			groupId: undefined,
		});
	};

	function onSubmit(values: z.infer<typeof requisitesSchema>) {
		setPending(true);
		console.log('Filter values:', values);
		getRequisites(values as IRequisitesFilter)
			.then((data:IRequisites[]) => {
				console.log('Filtered requisites:', data);
				addRequisite(data);
			})
			.catch((error) => {
				console.error('Error fetching requisites:', error);
			})
			.finally(() => {
				setPending(false);
			});
	}	

	return ( 
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="min-w-[1240px]">
			<Card className="w-full flex flex-row items-start xl:items-center justify-between mt-5">
        <div className="w-full flex gap-4">
					<FormField
						control={form.control}
						name="currencyId"
						render={({ field }) => (
							<FormItem>
								<Select
									key={field.value ?? 'empty'} 
									value={field.value?.toString()} 
									onValueChange={(val) => field.onChange(Number(val))}>
									<FormControl>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="Валюта" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectGroup>
											<SelectLabel>Валюты</SelectLabel>
												{currencies.map((currency) => (
													<SelectItem key={currency.id} value={currency.id.toString()}>
														{currency.name} - {currency.symbol}
													</SelectItem>
												))}
											</SelectGroup>
										</SelectContent>
									</Select>
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="bankId"
						render={({ field }) => (
							<FormItem>
								<Select
									key={field.value ?? 'empty'} 
									value={field.value?.toString()} 
									onValueChange={(val) => field.onChange(Number(val))}>
									<FormControl>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="Банк" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectGroup>
											<SelectLabel>Банки</SelectLabel>
											{banks.map((bank) => (
												<SelectItem key={bank.id} value={bank.id.toString()}>
													{bank.name}
												</SelectItem>
											))}
										</SelectGroup>
									</SelectContent>
								</Select>
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="paymentId"
						render={({ field }) => (
							<FormItem>
								<Select 
									key={field.value ?? 'empty'} 
									value={field.value?.toString()}
									onValueChange={(val) => field.onChange(Number(val))}>
									<FormControl>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="Способ оплаты" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectGroup>
											<SelectLabel>Способы оплаты</SelectLabel>
											{paymentMethod.map((payment) => (
												<SelectItem key={payment.id} value={payment.id.toString()}>
													{payment.name}
												</SelectItem>
											))}
										</SelectGroup>
									</SelectContent>
								</Select>
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="status"
						render={({ field }) => (
							<FormItem>
								<Select 
									key={field.value ?? 'empty'} 
									value={field.value?.toString()}
									onValueChange={(val) => field.onChange(Number(val))}>
									<FormControl>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="Статус" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectGroup>
											<SelectLabel>Статус</SelectLabel>
												<SelectItem value="1">Активен</SelectItem>
												<SelectItem value="0">Неактивен</SelectItem>
										</SelectGroup>
									</SelectContent>
								</Select>
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="groupId"
						render={({ field }) => (
							<FormItem>
								<Select 
									key={field.value ?? 'empty'} 
									value={field.value?.toString()}
									onValueChange={(val) => field.onChange(Number(val))}>
									<FormControl>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="Группа" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectGroup>
											<SelectLabel>Группы</SelectLabel>
											{groups.map((group) => (
												<SelectItem key={group.id} value={group.id.toString()}>
													{group.name}
												</SelectItem>
											))}
										</SelectGroup>
									</SelectContent>
								</Select>
							</FormItem>
						)}
					/>
        </div>
      	<div className="flex gap-2">
        	<Button disabled={pending} size="sm" type="submit">Применить</Button>
        	<Button onClick={resetForm} size="sm" variant="secondary" type="reset">Сбросить</Button>
      	</div>
    	</Card>
			</form>
		</Form>
	);
}

export default RequisitesFilter;