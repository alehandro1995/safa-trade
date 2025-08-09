"use client";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner";
import { useUserStore } from "@/store/user";
import { withdraw } from "@/actions/userAction";
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { MdOutlineFileUpload } from "react-icons/md";

const formSchema = z.object({
  amount: z.number("Обязательное поле")
		.min(100, "Минимальная сумма 100 USDT."),
  address: z.string("Обязательное поле")
		.min(12, "Минимальная длина 12 символов.").max(42, "Неверный адрес кошелька."),
});

const LIMIT = parseInt(process.env.NEXT_PUBLIC_LIMIT || "500", 10);

export default function ModalSend() {
	const user = useUserStore((state) => state.user);
	const [pending, setPending] = useState(false);
	const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: undefined,
      address: "",
    },
  });
	const handleSubmit = (values: z.infer<typeof formSchema>) => {
		setPending(true);
		if (!user || user.balance === undefined || user.fundsBlocked === undefined) {
			toast.error("Пожалуйста, войдите в систему для вывода средств.");
			return;
		}

		const balance = user.balance - (LIMIT + user.fundsBlocked);
		if (values.amount > balance) {
			toast.error(`Недостаточно средств.`);
			return;
		}

		withdraw(values.amount)
			.then(() => {
				toast.success(`Вывод ${values.amount} USDT на адрес ${values.address} успешно выполнен!`);
			})
			.catch((error) => {
				console.error("Ошибка при выводе средств:", error);
				toast.error("Ошибка при выводе средств, пожалуйста, попробуйте позже.");
			})
			.finally(() => {
				form.reset();
				setPending(false);
			});
	}

  return (
    <Dialog>    
        <DialogTrigger asChild>
          <Button variant="secondary">
						<MdOutlineFileUpload />
						<span className="text-[12px] font-semibold relative top-[2px]">Вывести</span>
					</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Вывод</DialogTitle>
            <DialogDescription>
              Вывод средств с вашего баланса. Пожалуйста, убедитесь, что вы ввели правильные данные.
            </DialogDescription>
          </DialogHeader>
					<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
						<FormField
							control={form.control}
							name="amount"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Сумма</FormLabel>
									<FormControl>
										<Input 
											placeholder="0.00" 
											{...field}
											value={field.value ?? ""}
											onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)} 
										/>
									</FormControl>
									<FormDescription>
										комиссия за вывод составляет 5.00 USDT
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="address"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Адрес кошелька (USDT TRC20)</FormLabel>
									<FormControl>
										<Input placeholder="Введите адрес" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<DialogFooter>
							<DialogClose asChild>
								<Button variant="outline">Отменить</Button>
							</DialogClose>
							<Button disabled={pending} type="submit">Вывести</Button>
						</DialogFooter>
					</form>
					</Form>
				</DialogContent>
    </Dialog>
  )
}