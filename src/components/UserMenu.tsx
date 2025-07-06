"use client";
import { toast } from "sonner";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { IoLogOutOutline } from "react-icons/io5";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function UserMenu() {
	const handleSwitchChange = (checked: boolean, data: "receive" | "send") => {
		if (data === "receive") {
			toast(`${checked ? "Приём включён" : "Приём выключен"}`, {
        description: `${checked ? "Ваш аккаунт включен на приём средств" : "Ваш аккаунт выключен на приём средств"}`,
        action: {
          label: "X",
					onClick: () => console.log("action clicked"),
        },
      })
		} else if (data === "send") {
			toast(`${checked ? "Выплаты включены" : "Выплаты выключены"}`, {
        description: `${checked ? "Ваш аккаунт включен на выплату средств" : "Ваш аккаунт выключен на выплату средств"}`,
        action: {
          label: "X",
					onClick: () => console.log("action clicked"),
        },
      })
		}
	}
	
	return ( 
		<DropdownMenu>
			<DropdownMenuTrigger className="cursor-pointer">
				<Avatar className="w-10 h-10">
					<AvatarFallback>MU</AvatarFallback>			
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuLabel>test@mail.ru</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuLabel>
					<div className="flex items-center space-x-2">
						<Switch id="receive" onCheckedChange={(checked) => handleSwitchChange(checked, "receive")} />
						<Label htmlFor="receive">Приём</Label>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuLabel>
					<div className="flex items-center space-x-2">
						<Switch id="send" onCheckedChange={(checked) => handleSwitchChange(checked, "send")}/>
						<Label htmlFor="send">Выплата</Label>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuLabel>
					<Link href="/login" className="w-full">
						<Button variant="link" className="w-full">
							<IoLogOutOutline/>
							Выйти
						</Button>
					</Link>
				</DropdownMenuLabel>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export default UserMenu;