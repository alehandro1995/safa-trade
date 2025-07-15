"use server";
import {prisma} from "@/client";
//import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function changeTransactionStatus(id: number) {
	console.log("TransactionID", id);
	await prisma.transaction.update({
		where: {
			id: id
		},
		data: {
			status: 'COMPLETED'
		}
	});

	revalidatePath("/deals");
}