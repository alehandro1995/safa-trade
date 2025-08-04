"use client";
import { useState } from "react";
import { toast } from "sonner";
//import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { IoLogOutOutline, IoPersonSharp } from "react-icons/io5";
import { changeUserStatus, logout } from "@/actions/userAction";
import type { TransactionType } from "@/generated/prisma";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type UserMenuProps = {
	email: string;
	balance: number;
	paymentStatus: boolean;
	receiveStatus: boolean;
};

function UserMenu({email, balance,paymentStatus, receiveStatus}: UserMenuProps) {
	const [receive, setReceive] = useState(receiveStatus);
	const [payment, setPayment] = useState(paymentStatus);

	const handleSwitchChange = (checked: boolean, data: "receive" | "payment") => {
		const type = data.toUpperCase() as TransactionType;
		if(balance <= 0 && type === "RECEIVE") {
			toast.error("Недостаточно средств для приёма");
			return;
		}

		if(type === "PAYMENT") {
			toast.error("Выплаты временно отключены");
			return;
		}
		
		changeUserStatus(type, checked)
			.then(() => {
				if (data === "receive") {
					setReceive(checked);
					toast.success(`${checked ? "Приём включён" : "Приём выключен"}`)
				} else if (data === "payment") {
					setPayment(checked);
					toast.success(`${checked ? "Выплаты включены" : "Выплаты выключены"}`)
				}
			}).catch((error) => {
				console.error("Error changing user status:", error);
				toast.error("Ошибка при изменении статуса");
			});
	}
	
	return ( 
		<DropdownMenu>
			<DropdownMenuTrigger className="cursor-pointer">
				<Avatar className="w-10 h-10">
					<AvatarFallback>
						<IoPersonSharp className="w-6 h-6" />
					</AvatarFallback>			
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuLabel>{email}</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuLabel>
					<div className="flex items-center space-x-2">
						<Switch 
							onCheckedChange={(checked) => handleSwitchChange(checked, "receive")} 
							checked={receive} 
						/>
						<Label htmlFor="receive">Приём</Label>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuLabel>
					<div className="flex items-center space-x-2">
						<Switch 
							onCheckedChange={(checked) => handleSwitchChange(checked, "payment")} 
							checked={payment} 
						/>
						<Label htmlFor="send">Выплата</Label>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuLabel>
					<Button
						onClick={logout} 
						variant="link" 
						className="w-full">
						<IoLogOutOutline/>
						Выйти
					</Button>
				</DropdownMenuLabel>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export default UserMenu;