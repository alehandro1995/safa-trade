"use client";
import {useState} from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner";
import { MdGroupAdd } from "react-icons/md";
import { FaRegTrashCan } from "react-icons/fa6";
import { addGroup, deleteGroup } from "@/actions/groupAction";
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

import type { Group } from "../../../generated/prisma";

const formSchema = z.object({
  name: z.string().min(3, "Минимум 3 символа").max(10, "Максимум 10 символов"),
})


export default function AddGroupModal({groups}: {groups: Group[]}) {
	const [items, setItems] = useState<Group[]>(groups);
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
		addGroup(name)
			.then((group: Group) => {
				setItems([...items, group]);
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
		deleteGroup(id)
		.then(() => {
			setItems(items.filter((item) => item.id !== id));
			toast.success('Группа удалена');
		})
		.catch((error) => {
			console.error('Error deleting group:', error);
			toast.error('Ошибка при удалении группы');
		});
	}

  return(
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="outline" size="sm">
					<MdGroupAdd />
					<span>Группы</span>
				</Button>
			</DialogTrigger>
			<DialogContent className="w-[800px]">
				<DialogHeader>
					<DialogTitle>Группы</DialogTitle>
					<DialogDescription>
						Управление вашими группами. Вы можете добавлять новые группыа и удалять существующие.
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
								Нет добавленных групп
							</TableCell>
						</TableRow>
					)}
					{items.length > 0 && items.map((item, index) => (
						<TableRow key={index}>
							<TableCell>
								<span>{item.token.substring(0, 12)}</span>
							</TableCell>
							<TableCell>
								<span>{item.name}</span>
							</TableCell>
							<TableCell className="text-right">
								<Button
									onClick={() => remove(item.id)} 
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
											placeholder="Введите имя группы" 
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