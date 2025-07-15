"use client"
import { useForm } from "react-hook-form";
import { toast } from "sonner"
import { FaTelegramPlane } from "react-icons/fa";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { User } from "../../generated/prisma";
const formSchema = z.object({
	password: z.string().min(5, "Минимум 5 символов").max(20, "Максимум 20 символов"),
	confirm: z.string().min(1, "Обязательное поле"),
}).refine((data) => data.password === data.confirm, {
	message: "Пароли отличаются",
	path: ["confirm"],
});

function PasswordForm({user}: {user: User}) {
  const form = useForm<z.infer<typeof formSchema>>({
			resolver: zodResolver(formSchema),
			defaultValues: {
				confirm: "",
				password: "",
			},
		})
  
  async function onSubmit(data: z.infer<typeof formSchema>) {

    const formData = new FormData();
    formData.append("password", data.password);
    formData.append("id", user.id.toString());
  
    try {
      const response = await fetch("/api/confirm", {
        method: "POST",
        body: formData,
      });
  
      if (response.ok) {
				toast.success("Пароль успешно создан!")
        location.href = "/login";
      } else {
        throw new Error("Ошибка сервера");
      }
    } catch (error) {
      console.error(error);
			throw new Error("Ошибка сервера");
    }
  }
  
  return ( 
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
			<Card className="w-96 mt-20">
			<CardHeader>
				<CardTitle>Регистрация</CardTitle>
				<CardDescription>Пожалуйста, создайте новый пароль для <b>входа</b>.</CardDescription>
				<CardAction className="cursor-pointer opacity-90 hover:opacity-100 transition-opacity">
					<FaTelegramPlane />
				</CardAction>
			</CardHeader>
			<CardContent className="flex flex-col gap-5">
				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Пароль</FormLabel>
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
			</CardContent>
			<CardFooter>
				<Button type="submit" className="w-full cursor-pointer">
          Создать
        </Button>
			</CardFooter>
			</Card>
    </form>
		</Form>
  );
}

export default PasswordForm;