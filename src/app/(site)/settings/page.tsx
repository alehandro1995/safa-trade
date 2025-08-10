"use client";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { GoAlertFill } from "react-icons/go";
import { changePassword } from "@/actions/userAction";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
	password: z.string().min(5, "Минимум 5 символов").max(20, "Максимум 20 символов"),
	confirm: z.string().min(1, "Обязательное поле"),
}).refine((data) => data.password === data.confirm, {
	message: "Пароли отличаются",
	path: ["confirm"],
});

export default function Home() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
			defaultValues: {
				confirm: "",
				password: "",
			},
		});

	async function onSubmit(data: z.infer<typeof formSchema>) {
		console.log(data);
		changePassword(data.password)
			.then(() => {
				toast.success("Пароль успешно изменен");
				form.reset();
			})
			.catch((error) => {
				console.error(error);
				toast.error("Ошибка при изменении пароля");
			});
	}
	
  return (
    <section className="p-6 overflow-auto">
			<div className="flex flex-col items-center h-full w-full min-w-[900px]">
			<h1 className="text-2xl my-10">Двухфакторная аутентификация</h1>
			<Card className="w-[800px] grid grid-cols-3">
				<div className="flex items-center">Статус:</div>
				<Badge variant={"destructive"} className="flex items-center gap-x-2">
					<GoAlertFill className="text-xl" />
					<span className="text-sm">отключено</span>
				</Badge>
				<Button onClick={() =>toast.error("Аккаунт не активен")}>Включить</Button>
			</Card>
			<h1 className="text-2xl my-10">Telegram</h1>
			<Card className="w-[800px] grid grid-cols-3">
				<div className="flex items-center">Бот уведомлений:</div>
				<Badge variant={"destructive"}>
					<GoAlertFill className="text-xl" />
					<span className="text-sm">не привязан</span>
				</Badge>
				<Button onClick={() =>toast.error("Аккаунт не активен")}>Подключить</Button>
			</Card>
      <h1 className="text-2xl my-10">Изменение пароля</h1>
      <Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
				<Card className="w-[800px] grid grid-cols-3 items-center">
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Новый пароль</FormLabel>
								<FormControl>
									<Input type="password" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="confirm"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Подтвердить пароль</FormLabel>
								<FormControl>
									<Input type="password" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type="submit" className="w-full cursor-pointer self-end">Создать</Button>
				</Card>
				</form>
      </Form>
			</div>
    </section>
  );
}