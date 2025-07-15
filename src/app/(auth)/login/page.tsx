"use client";
import { useState } from "react";
import { useForm } from "react-hook-form"
import { useRouter } from 'next/navigation';
import { FaTelegramPlane } from "react-icons/fa";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const formSchema = z.object({
  email: z.email("Неверный формат email").min(1, "Обязательное поле"),
	password: z.string().min(1, "Обязательное поле"),
})

function Page() {
	const router = useRouter();
  const [apiError, setApiError] = useState<boolean>(false);
  
	const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
			password: "",
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);
		
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        if (result.email === "") {
          setApiError(true);
          return;
        }

        router.push("/");
      } else {	
				console.log(response);
        if (response.status === 400) {
          setApiError(true);
        }else{
          throw new Error("Ошибка сервера");
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

	return ( 
		<Form {...form}>
		<form onSubmit={form.handleSubmit(onSubmit)}
			className="flex min-h-screen flex-col items-center justify-between">
			<Card className="w-96 mt-20">
				<CardHeader>
					<CardTitle>Войти</CardTitle>
					<CardDescription>
						<p>Пожалуйста, войдите в аккаунт, чтобы продолжить.</p>
						{apiError && (
							<p className="text-destructive mt-5">Неверный email или пароль</p>
						)}
					</CardDescription>
					<CardAction className="cursor-pointer opacity-90 hover:opacity-100 transition-opacity">
						<Link href="/">
							<FaTelegramPlane />
						</Link>
					</CardAction>
				</CardHeader>
				<CardContent className="flex flex-col gap-5">
          <FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input type="email" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
          <FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Password</FormLabel>
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
          	Войти
        	</Button>
				</CardFooter>
			</Card>
		</form>
		</Form>
	);
}

export default Page;