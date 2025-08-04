"use client";
import { useEffect } from "react";
import { useActionState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { updateUser } from "@/actions/userAction";
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

import type { User } from "@/generated/prisma";

const initialState = {
  message: '',
}

function Form({ user }: { user: User }) {
	const router = useRouter();
  const [state, formAction, pending] = useActionState(updateUser, initialState);
	useEffect(() => {
		if (state?.message) {
			if (state.message === 'success') {
				toast.success("Пользователь успешно обновлен!");
				router.push("/admin");
			} else {
				toast.error("Ошибка при обновлении пользователя!");
			}
		}
	}, [state]);

  return ( 
		<form action={formAction}>
      <Card className="w-[600px] mt-20">
				<CardHeader>
					<CardTitle>Редактировать пользователя</CardTitle>
					<CardDescription>
						{state?.message === 'error' && (
							<span className="text-destructive my-2">Ошибка при обновлении пользователя!</span>
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
            <Input type="email" name="email" defaultValue={user.email}/>
          </div>
					<div className="grid grid-cols-2 relative pb-5">
						<Label htmlFor="email" className="block mt-4">Balance</Label>
						<Input type="text" name="balance" defaultValue={user.balance}/>
					</div>
					<div className="grid grid-cols-2 relative pb-5">
						<Label htmlFor="email" className="block mt-4">Pay-In-Gambling</Label>
						<Input type="text" name="payInGambling" defaultValue={user?.payInGambling} />
					</div>
					<div className="grid grid-cols-2 relative pb-5">
						<Label htmlFor="email" className="block mt-4">Pay-In-Exchangers</Label>
						<Input type="text" name="payInExchangers" defaultValue={user?.payInExchangers} />
					</div>
					<div className="grid grid-cols-2 relative pb-5">
						<Label htmlFor="email" className="block mt-4">Pay-Out-Gambling</Label>
						<Input type="text" name="payOutGambling" defaultValue={user?.payOutGambling} />
					</div>
					<div className="grid grid-cols-2 relative pb-5">
						<Label htmlFor="email" className="block mt-4">Pay-Out-Exchangers</Label>
						<Input type="text" name="payOutExchangers" defaultValue={user?.payOutExchangers}/>
					</div>
				</CardContent>
				<CardFooter>
					<Button type="submit" disabled={pending}>Сохранить</Button>
				</CardFooter>	
      </Card>
		</form>
  );
}

export default Form;