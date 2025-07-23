"use client";
import { useEffect } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner"
import { createUser } from "../../../../actions/userAction";
import Link from "next/link";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";


const initialState = {
  message: '',
}

function Page() {
	const router = useRouter();
  const [state, formAction, pending] = useActionState(createUser, initialState);
	useEffect(() => {
		if (state?.message) {
			if (state.message === 'success') {
				toast.success("Пользователь успешно создан!");
				router.push("/admin");
			} else {
				toast.error("Пользователь с таким Email уже существует!");
			}
		}
	}, [state]);

  return ( 
    <div className="container mx-auto flex justify-center">
			<form action={formAction}>
      <Card className="w-[600px] mt-20">
				<CardHeader>
					<CardTitle>Добавить пользователя</CardTitle>
					<CardDescription>
						{state?.message === 'error' && (
							<span className="text-red-500 my-2">Пользователь с таким Email уже существует!</span>
						)}
					</CardDescription>
					<CardAction className="cursor-pointer opacity-90 hover:opacity-100 transition-opacity">
						<Link href="/admin">
							<Button variant="link" size="icon">Назад</Button>
						</Link>
					</CardAction>
				</CardHeader>
        <CardContent className="flex flex-col gap-2">
          <div className="grid grid-cols-2 relative pb-5">
            <Label htmlFor="email" className="block mt-4">Email</Label>
            <Input type="email" name="email" />
          </div>
					<div className="grid grid-cols-2 relative pb-5">
						<Label htmlFor="email" className="block mt-4">Balance</Label>
						<Input type="text" name="balance" />
					</div>
					<div className="grid grid-cols-2 relative pb-5">
						<Label htmlFor="email" className="block mt-4">Pay-In-Gambling</Label>
						<Input type="text" name="payInGambling" />
					</div>
					<div className="grid grid-cols-2 relative pb-5">
						<Label htmlFor="email" className="block mt-4">Pay-In-Exchangers</Label>
						<Input type="text" name="payInExchangers" />
					</div>
					<div className="grid grid-cols-2 relative pb-5">
						<Label htmlFor="email" className="block mt-4">Pay-Out-Gambling</Label>
						<Input type="text" name="payOutGambling" />
					</div>
					<div className="grid grid-cols-2 relative pb-5">
						<Label htmlFor="email" className="block mt-4">Pay-Out-Exchangers</Label>
						<Input type="text" name="payOutExchangers" />
					</div>
				</CardContent>
				<CardFooter>
					<Button type="submit" disabled={pending}>Создать</Button>
				</CardFooter>	
      </Card>
			</form>
    </div>
  );
}

export default Page;