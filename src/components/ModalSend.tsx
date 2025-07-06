"use client";
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MdOutlineFileUpload } from "react-icons/md";

export default function ModalSend() {
	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const amount = formData.get("amount");
		const walletAddress = formData.get("address");
		console.log("Вывод средств:", amount, walletAddress);
	}

  return (
    <Dialog>
      
        <DialogTrigger asChild>
          <Button variant="secondary">
						<MdOutlineFileUpload />
						<span className="text-[12px] font-semibold relative top-[2px]">Вывести</span>
					</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Вывод</DialogTitle>
            <DialogDescription>
              Вывод средств с вашего баланса. Пожалуйста, убедитесь, что вы ввели правильные данные.
            </DialogDescription>
          </DialogHeader>
					<form onSubmit={handleSubmit}>
          <div className="w-full flex flex-col items-center p-4">
            <div className="relative w-full pb-5">
              <Label>Сумма: 0.000000</Label>
              <Input className="w-full border border-gray-600 rounded-sm p-2" type="text" name="amount" />
              <span>комиссия за вывод составляет 5.00 USDT</span>
            </div>
            <div className="relative w-full pb-5">
              <Label>Адрес кошелька (USDT TRC20)</Label>
              <Input className="w-full border border-gray-600 rounded-sm p-2" type="text" name="address"/>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Отменить</Button>
            </DialogClose>
            <Button type="submit">Вывести</Button>
          </DialogFooter>
					</form>
        </DialogContent>
    </Dialog>
  )
}