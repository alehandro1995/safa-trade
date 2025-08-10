"use client";
import { useState } from "react";
import { 
	MdOutlineFileCopy, 
	MdFileCopy, 
	MdOutlineFileDownload 
} from "react-icons/md";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";


export default function ModalReceive() {
  const [copied, setCopied] = useState(false);
  const address = "TTEfvxtBFSmjy8uh6u3nb4AnEAZ1UHymM6"; // Укажи свой TRC20 адрес

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  
  return(
    <AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant="secondary">
					<MdOutlineFileDownload />
					<span className="text-[12px] font-semibold relative top-[2px]">Пополнить</span>
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent className="overflow-auto">
				<AlertDialogHeader>
					<AlertDialogTitle>Пополнение</AlertDialogTitle>
					<AlertDialogDescription>
						Для пополнения баланса переведите средства на указанный ниже адрес.					
					</AlertDialogDescription>
				</AlertDialogHeader>
				<div className="w-full flex flex-col items-center p-4">
					<h4 className="text-lg mb-2">Адрес кошелька (USDT TRC20)</h4>
					<div className="min-w-[420px] w-full h-12 flex items-center justify-center gap-x-2 bg-green-700 rounded-md">
						<span className="text-emerald-100">{address}</span>
						<div className="relative">
							{copied && <div className="absolute -top-4 -left-5 text-[10px] text-yellow-300">Скопировано</div>}
							{!copied 
								?
									<MdOutlineFileCopy onClick={copyToClipboard} className="text-2xl text-emerald-100/90 hover:text-emerald-100 cursor-pointer"/>
									:
									<MdFileCopy onClick={copyToClipboard} className="text-2xl text-emerald-100/90 hover:text-emerald-100 cursor-pointer"/>
								}
						</div>
					</div>
				</div>
				<AlertDialogFooter>
					<AlertDialogCancel>Закрыть</AlertDialogCancel>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
  )
}