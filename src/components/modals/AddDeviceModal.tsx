"use client";
import {useState} from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner";
import { MdPhoneIphone } from "react-icons/md";
import { FaRegTrashCan } from "react-icons/fa6";
import { addDevice, getDevices, deleteDevice } from "@/actions/deviceAction";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
	DialogFooter,
	DialogDescription,
} from "@/components/ui/dialog"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"

import type { Device } from "../../../generated/prisma";

const formSchema = z.object({
  name: z.string().min(3, "Минимум 3 символа").max(10, "Максимум 10 символов"),
})

export default function AddDeviceModal({devices}: {devices: Device[]}) {
	const [items, setItems] = useState<Device[]>(devices);
	const [pending, setPending] = useState(false);
	const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

	function onSubmit(values: z.infer<typeof formSchema>) {
    const name: string = values.name.trim();
		setPending(true);
		addDevice(name)
			.then((device: Device) => {
				setItems([...items, device]);
				toast.success('Устройство добавлено');
				form.reset();
			})
			.catch((error) => {
				console.error('Error adding device:', error);
				toast.error('Ошибка при добавлении устройства');
			})
			.finally(() => {
				setPending(false);
			});
  }

	const remove = async (id: number) => {
		deleteDevice(id)
		.then(() => {
			setItems(items.filter((item) => item.id !== id));
			toast.success('Устройство удалено');
		})
		.catch((error) => {
			console.error('Error deleting device:', error);
			toast.error('Ошибка при удалении устройства');
		});
	}

  return(
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="outline" size="sm">
					<MdPhoneIphone />
					<span>Устройства</span>
				</Button>
			</DialogTrigger>
			<DialogContent className="w-[800px]">
				<DialogHeader>
					<DialogTitle>Устройства</DialogTitle>
					<DialogDescription>
						Управление вашими устройствами. Вы можете добавлять новые устройства и удалять существующие.
					</DialogDescription>
				</DialogHeader>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>ID</TableHead>
							<TableHead>Имя</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
					{items.length === 0 && (
						<TableRow>
							<TableCell colSpan={2} className="text-center">
								Нет добавленных устройств
							</TableCell>
						</TableRow>
					)}
					{items.length > 0 && items.map((device, index) => (
						<TableRow key={index}>
							<TableCell>
								<span>{device.deviceId.substring(0, 12)}</span>
							</TableCell>
							<TableCell>
								<span>{device.name}</span>
							</TableCell>
							<TableCell className="text-right">
								<Button
									onClick={() => remove(device.id)} 
									variant="ghost" 
									className="col-span-1 justify-self-end">
									<FaRegTrashCan />
								</Button>
							</TableCell>
          	</TableRow>
					))}
					</TableBody>
				</Table>
        <DialogFooter>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} 
						className="w-full grid grid-cols-2 gap-x-5">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input 
											{...field} 
											type="text" 
											placeholder="Введите имя устройства" 
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
            <Button disabled={pending} size="sm" type="submit">Добавить</Button>
					</form>
					</Form>
				</DialogFooter>
      </DialogContent>
		</Dialog>
  )
}