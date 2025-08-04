"use client";
import { useEffect, useState } from "react";
import { useUserStore } from "@/store/user";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { BsFillBellFill } from "react-icons/bs";
import { IoLogOutOutline } from "react-icons/io5";
import { IoIosMenu } from "react-icons/io";
import { getUser, logout } from "@/actions/userAction";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
	SheetClose
} from "@/components/ui/sheet";

import { Button } from "./ui/button";
import MobileToggle from "./MobileToggle";
import UserMenu from "./UserMenu";
import type { IUserInfo } from "@/types/User";

function Header() {
	const createUser = useUserStore((state) => state.createUser);
	const user = useUserStore((state) => state.user);
	const isMobile = useMediaQuery("(min-width: 1024px)");
	const pathname = usePathname();
	if (!pathname) return null;

	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		getUser().then((user) => {
			if (!user) {
				window.location.href = "/login";
			}
			
			createUser(user as IUserInfo);
		}).catch((error) => {
			console.error("Error fetching user:", error);
			window.location.href = "/login";
		}).finally(() => {
			setIsLoading(false);
		});
	}, []);
	
	if (isLoading) {
		return (
			<div className="flex items-center h-12 lg:h-16 bg-emerald-200 text-green-900 shadow-md px-2 lg:px-4">
				<Skeleton className="h-8 w-full lg:h-10" />
			</div>
		);
	}	

	return ( 
		<div className="flex items-center h-12 lg:h-16 bg-emerald-200 text-green-900 shadow-md px-2 lg:px-4">
			<Link href="/" className="w-fit flex items-center text-lg lg:text-2xl font-bold">
				<Image 
					src="/logo.png" 
					alt="Logo" 
					width={!isMobile ? 40 : 30} 
					height={!isMobile ? 40 : 30} 
					className="inline-block mr-2" 
				/>
				<h1 style={{fontFamily: "marhey", marginTop:"5px"}}>SafaTrade</h1>
			</Link>
			<Separator orientation="vertical" className="mx-4 bg-emerald-300" />
			{!isMobile && LinkList(isMobile, pathname)}
			<Separator orientation="vertical" className="ml-auto mr-2 lg:mr-4 bg-emerald-300" />
			{isMobile
				?
				<Sheet>
					<SheetTrigger asChild>
						<IoIosMenu className="text-2xl cursor-pointer" />
					</SheetTrigger>
					<SheetContent className="w-full h-screen overflow-y-auto" side="right">
						<SheetHeader>
							<SheetTitle>{user ? user.email : <Skeleton className="h-4 w-1/2" />}</SheetTitle>
						</SheetHeader>
						{ user
							? <MobileToggle	
									paymentStatus={user.paymentStatus} 
									receiveStatus={user.receiveStatus}
									balance={user.balance}
								/>
							: <div className="pl-4">
									<Skeleton className="h-4 w-1/2 mb-2" />
									<Skeleton className="h-4 w-1/2 mb-2" />
								</div>
						}
						{LinkList(isMobile, pathname)}
						<SheetFooter>
							<SheetClose asChild>
								<Button
									onClick={logout} 
									variant="secondary" 
									className="w-full">
									<IoLogOutOutline />
									Выйти
								</Button>
							</SheetClose>
						</SheetFooter>
					</SheetContent>
				</Sheet>
				:
				<div className="w-fit flex items-center gap-x-4">
					{user
						? <UserMenu 
								email={user.email} 
								balance={user.balance}
								paymentStatus={user.paymentStatus} 
								receiveStatus={user.receiveStatus} 
							/>
						: <Skeleton className="h-10 w-10 rounded-full" />
					}
					<Popover>
  					<PopoverTrigger className="relative cursor-pointer">
							{/*<TbPointFilled className="absolute left-0 top-0 text-yellow-300" />*/}
							<BsFillBellFill className="text-2xl text-green-900" />
						</PopoverTrigger>
  					<PopoverContent>Нет новых уведомлений</PopoverContent>
					</Popover>
				</div>
			}
		</div>
	);
}

const LinkList = (isMobile:boolean, pathname:string) => {

	return (
		<div className={`flex ${isMobile && "flex-col w-full"} `}>
			<Link href="/" className={`link ${pathname === "/" && "active"} ${isMobile && "w-full"}`}>
				{isMobile ? <SheetClose className="w-full text-left">Главная</SheetClose> : "Главная"}
			</Link>
			<Link href="/statistic" className={`link ${pathname === "/statistic" && "active"} ${isMobile && "w-full"}`}>
				{isMobile ? <SheetClose className="w-full text-left">Статистика</SheetClose> : "Статистика"}
			</Link>
			<Link href="/history" className={`link ${pathname === "/history" && "active"} ${isMobile && "w-full"}`}>
				{isMobile ? <SheetClose className="w-full text-left">История операций</SheetClose> : "История операций"}
			</Link>
			<Link href="/deals" className={`link ${pathname === "/deals" && "active"} ${isMobile && "w-full"}`}>
				{isMobile ? <SheetClose className="w-full text-left">Сделки</SheetClose> : "Сделки"}
			</Link>
			<Link href="/requisites" className={`link ${pathname === "/requisites" && "active"} ${isMobile && "w-full"}`}>
				{isMobile ? <SheetClose className="w-full text-left">Реквизиты</SheetClose> : "Реквизиты"}
			</Link>
			<Link href="/settings" className={`link ${pathname === "/settings" && "active"} ${isMobile && "w-full"}`}>
				{isMobile ? <SheetClose className="w-full text-left">Настройки</SheetClose> : "Настройки"}
			</Link>
		</div>
	);
}

export default Header;