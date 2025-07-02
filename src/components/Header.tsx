import Link from "next/link";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Toggle } from "@/components/ui/toggle"
import { BsFillBellFill } from "react-icons/bs";

function Header() {
	return ( 
		<div className="flex items-center h-16 bg-emerald-100 text-green-900 shadow-md px-4">
			<Link href="/" className="flex items-center text-xl font-bold">
				<Image src="/logo.png" alt="Logo" width={40} height={40} className="inline-block mr-2" />
				<h1>SafaTrade</h1>
			</Link>
			<Separator orientation="vertical" className="mx-4 bg-emerald-300" />
			<div className="w-fit flex items-center">
				<Link href="/" className="link">
					Главная
				</Link>
				<Link href="/statistic" className="link">
					Статистика
				</Link>
				<Link href="/history" className="link">
					История операций
				</Link>
				<Link href="/deals" className="link">
					Сделки
				</Link>
				<Link href="/requisites" className="link">
					Реквизиты
				</Link>
				<Link href="/settings" className="link">
					Настройки
				</Link>
			</div>
			<Separator orientation="vertical" className="ml-auto mr-4 bg-emerald-300" />
			<div className="w-fit flex items-center gap-x-2">
				<Avatar className="w-10 h-10">
					<AvatarFallback>MU</AvatarFallback>
				</Avatar>
				<Toggle>
					<BsFillBellFill className="text-2xl text-green-900" />
				</Toggle>
			</div>
		</div>
	);
}

export default Header;