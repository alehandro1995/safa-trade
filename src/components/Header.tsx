"use client";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle"
import { BsFillBellFill } from "react-icons/bs";
import { TbPointFilled } from "react-icons/tb";
import { IoLogOutOutline } from "react-icons/io5";
import { IoIosMenu } from "react-icons/io";

import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
	SheetClose
} from "@/components/ui/sheet"

import { Button } from "./ui/button";
import MobileToggle from "./MobileToggle";
import UserMenu from "./UserMenu";

function Header() {
	const isMobile = useMediaQuery("(min-width: 1024px)");
	const pathname = usePathname();
	if (!pathname) return null;

	console.log("isMobile", isMobile);
	return ( 
		<div className="flex items-center h-12 lg:h-16 bg-emerald-100 text-green-900 shadow-md px-2 lg:px-4">
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
							<SheetTitle>test@mail.ru</SheetTitle>
						</SheetHeader>
						<MobileToggle	/>
						{LinkList(isMobile, pathname)}
						<SheetFooter>
							<Link href="/login">
								<SheetClose asChild>
									<Button variant="secondary" className="w-full">
										<IoLogOutOutline />
										Выйти
									</Button>
								</SheetClose>
							</Link>
						</SheetFooter>
					</SheetContent>
				</Sheet>
				:
				<div className="w-fit flex items-center gap-x-4">
					<UserMenu />
					<Toggle className="relative">
						<TbPointFilled className="absolute left-0 top-0 text-yellow-300" />
						<BsFillBellFill className="text-2xl text-green-900" />
					</Toggle>
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