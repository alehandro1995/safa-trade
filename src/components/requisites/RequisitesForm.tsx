"use client"
import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useUserStore } from "@/store/user";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { createRequisites, updateRequisites } from "@/actions/requisitesAction";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
//import { Label } from "./ui/label";

import { 
	Card, 
	CardHeader, 
	CardTitle, 
	CardDescription, 
	CardContent, 
	CardFooter 
} from "../ui/card";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
	FormLabel,
} from "@/components/ui/form"

import type { 
	currency, 
	bank_name, 
	payment_method, 
	Group, 
	Device 
} from "../../../generated/prisma";

import type { ICreateRequisites, IUpdateRequisites } from "@/types/Requisites";

type AddRequisitesProps = {
	currencies: currency[];
	banks: bank_name[];
	paymentMethod: payment_method[];
	groups: Group[];
	devices: Device[];
	requisites: ICreateRequisites | IUpdateRequisites | null;
	type: "create" | "update";
}

// Валидация данных с помощью Zod
const requisitesSchema = z.object({
	currencyId: z.number("Выберите валюту"),
	bankId: z.number("Выберите банк"),
	paymentId: z.number("Выберите способ оплаты"),
	cardNumber: z.string("Введите номер карты"),
	cardOwner: z.string("Введите имя владельца карты"),
	card: z.string("Введите тип карты"),
	groupId: z.number("Выберите группу").optional(),
	deviceId: z.number("Выберите устройство").optional(),
	minOrder: z.number().optional(),
	maxOrder: z.number().optional(),
	dayLimit: z.number().optional(),
	monthLimit: z.number().optional(),
	dayQuantity: z.number().optional(),
	monthQuantity: z.number().optional(),
	concurrentOrder: z.number().optional(),
	minutesDelay: z.number().optional(),
});

export default function RequisitesForm(
	{ currencies, banks, paymentMethod, groups, devices, requisites, type }: 
AddRequisitesProps) {
	const router = useRouter();
	const [pending, setPending] = useState(false);
	const user = useUserStore((state) => state.user);

	const defaultValues = useMemo(() => {
		if (requisites) return requisites;
		return {
			currencyId: undefined,
			bankId: undefined,
			paymentId: undefined,
			cardNumber: '',
			cardOwner: '',
			card: '',
			groupId: undefined,
			deviceId: undefined,	
			minOrder: undefined,
			maxOrder: undefined,
			dayLimit: undefined,
			monthLimit: undefined,
			dayQuantity: undefined,
			monthQuantity: undefined,
			concurrentOrder: undefined,
			minutesDelay: undefined
		};
	}, [requisites]);

	const form = useForm<z.infer<typeof requisitesSchema>>({
		resolver: zodResolver(requisitesSchema),
		defaultValues,
		mode: "onChange",
	});
	
	function onSubmit(values: z.infer<typeof requisitesSchema>) {
		if (!user) return;
		setPending(true);
		
		if (type === "update" && requisites) {
			const {id } = requisites as IUpdateRequisites;
			const data = {id: id, userId: user?.id, ...values} as IUpdateRequisites;
			updateRequisites(data)
				.then(() => {
					toast.success('Реквизиты успешно обновлены');
					router.push('/requisites');
				})
				.catch((error) => {
					console.error('Error updating requisites:', error);
					toast.error('Ошибка при обновлении реквизитов');
					form.reset();
				})
				.finally(() => {
					setPending(false);
				});
		}else if (type === "create") {
			const data = {userId: user?.id, ...values} as ICreateRequisites;
			createRequisites(data)
				.then(() => {
					toast.success('Реквизиты успешно добавлены');
					router.push('/requisites');
				})
				.catch((error) => {
					console.error('Error adding requisites:', error);
					toast.error('Ошибка при добавлении реквизитов');
					form.reset();
				})
				.finally(() => {
					setPending(false);
				});
		}else{
			// Handle unexpected form type
			toast.error('Неизвестный тип формы');
			setPending(false);
		}
	}

  return(
    <Card className="w-full mt-6">
			<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <CardHeader>
					<CardTitle>Добавить реквизиты</CardTitle>
					<CardDescription>
						Заполните форму для добавления новых реквизитов.
					</CardDescription>
				</CardHeader>
        <CardContent className="flex flex-col sm:grid grid-cols-2 gap-6 p-0 mt-10">
					
          <FormField
						control={form.control}
						name="currencyId"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Валюта</FormLabel>
								<Select
									value={field.value?.toString()} 
									onValueChange={(val) => field.onChange(Number(val))}>
									<FormControl>
										<SelectTrigger className="w-full">
											<SelectValue />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectGroup>
											<SelectLabel>Валюты</SelectLabel>
											{currencies.map((currency) => (
												<SelectItem key={currency.id} value={currency.id.toString()}>
													{currency.name}
												</SelectItem>
											))}
										</SelectGroup>
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>
					
					<FormField
						control={form.control}
						name="bankId"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Банк</FormLabel>
								<Select
									value={field.value?.toString()} 
									onValueChange={(val) => field.onChange(Number(val))}>
									<FormControl>
										<SelectTrigger className="w-full">
											<SelectValue />
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
								<FormMessage />
							</FormItem>
						)}
					/>
					
					<FormField
						control={form.control}
						name="paymentId"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Способ оплаты</FormLabel>
								<Select 
									value={field.value?.toString()}
									onValueChange={(val) => field.onChange(Number(val))}>
									<FormControl>
										<SelectTrigger className="w-full">
											<SelectValue />
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
								<FormMessage />
							</FormItem>
						)}
					/>
          
          <FormField
						control={form.control}
						name="cardNumber"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Номер счета</FormLabel>
								<FormControl>
									<Input 
										{...field} 
										type="text" 
										value={field.value ?? ''}
										onChange={(e) => field.onChange(e.target.value)}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
          	)}
        	/>
          
          <FormField
						control={form.control}
						name="cardOwner"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Имя владельца</FormLabel>
								<FormControl>
									<Input 
										{...field}
										value={field.value ?? ''}
										onChange={(e) => field.onChange(e.target.value)}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="card"
						render={({field}) => (
							<FormItem>
								<FormLabel>Номер карты</FormLabel>
								<FormControl>
									<Input 
										{...field} 
										type="text"
										value={field.value ?? ''}
										onChange={(e) => field.onChange(e.target.value)} 
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>	
        
					<FormField
						control={form.control}
						name="groupId"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Группа</FormLabel>
								<Select 
									value={field.value?.toString()}
									onValueChange={(val) => field.onChange(Number(val))}>
									<FormControl>
										<SelectTrigger className="w-full">
											<SelectValue />
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
								<FormMessage />
							</FormItem>
						)}
					/>
          
					<FormField
						control={form.control}
						name="deviceId"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Устройство</FormLabel>
								<Select 
									value={field.value?.toString()}
									onValueChange={(val) => field.onChange(Number(val))}>
									<FormControl>
										<SelectTrigger className="w-full">
											<SelectValue />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectGroup>
											<SelectLabel>Устройства</SelectLabel>
											{devices.map((device) => (
												<SelectItem key={device.id} value={device.id.toString()}>
													{device.name}
												</SelectItem>
											))}
										</SelectGroup>
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>
					
          <h4 className="col-span-2 text-center text-lg my-2">Лимиты</h4>
          <FormField
						control={form.control}
						name="minOrder"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Мин. сумма сделки</FormLabel>
								<FormControl>
									<Input 
										{...field} 
										type="number"
										value={field.value ?? ''}
										onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
									/>	
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>	
          <FormField
						control={form.control}
						name="maxOrder"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Макс. сумма сделки</FormLabel>
								<FormControl>
									<Input 
										{...field} 
										type="number"
										value={field.value ?? ''}
										onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
									/>	
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="dayLimit"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Макс сумма (день)</FormLabel>
								<FormControl>
									<Input 
										{...field} 
										type="number" 
										value={field.value ?? ''}
										onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
									/>	
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>	
         <FormField
						control={form.control}
						name="monthLimit"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Макс сумма (месяц)</FormLabel>
								<FormControl>
									<Input 
										{...field} 
										type="number"
										value={field.value ?? ''}
										onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
									/>	
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>	
          <FormField
						control={form.control}
						name="dayQuantity"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Кол-во (день)</FormLabel>
								<FormControl>
									<Input 
										{...field} 
										type="number"
										value={field.value ?? ''}
										onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
									/>	
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>	
          <FormField
						control={form.control}
						name="monthQuantity"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Кол-во (месяц)</FormLabel>
								<FormControl>
									<Input 
										{...field} 
										type="number"
										value={field.value ?? ''}
										onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
									/>	
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>	
          <FormField
						control={form.control}
						name="concurrentOrder"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Одновременных сделок</FormLabel>
								<FormControl>
									<Input 
										{...field} 
										type="number" 
										value={field.value ?? ''}
										onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
									/>	
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>	
          <FormField
						control={form.control}
						name="minutesDelay"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Задержка (минуты)</FormLabel>
								<FormControl>
									<Input 
										{...field} 
										type="number"
										value={field.value ?? ''}
  									onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))} 
									/>	
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>	
        </CardContent> 
				<CardFooter className="w-full flex justify-end gap-x-6 mt-4">
					<Button variant="outline" type="reset">Сбросить</Button>
					<Button type="submit" disabled={pending}>{type === 'create' ? 'Сохранить' : 'Изменить'}</Button>
				</CardFooter>
      </form>
			</Form>
		</Card>
  )
}