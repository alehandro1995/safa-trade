"use server";
import {prisma} from "@/client";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import type { 
	IRequisites,
	ICreateRequisites, 
	IUpdateRequisites,
	IRequisitesFilter
} from "@/types/Requisites";

export async function getRequisites(data: IRequisitesFilter): Promise<IRequisites[]> {
	const cookie = await cookies();
	const email = cookie.get('email')?.value;
	if (!email) {
		throw new Error('Email not found in cookies');
	}

	const user = await prisma.user.findUnique({
		where: {
			email: email
		}
	});

	if (!user) {
		throw new Error('User not found');
	}

	const whereFilter:any = {
		userId: user.id
	}

	if (data.currencyId) {
		whereFilter.currencyId = data.currencyId;
	}

	if (data.bankId) {
		whereFilter.bankId = data.bankId;
	}

	if (data.paymentId) {
		whereFilter.paymentId = data.paymentId;
	}

	if (data.status) {
		whereFilter.status = data.status === 1 ? true : false;
	}

	console.log('Where filter:', whereFilter);
	const requisites = await prisma.requisites.findMany({
		where: whereFilter,
		include: {
			currency: true,
			bankName: true,
			paymentMethod: true
		}
	});

	return requisites;
}

export async function createRequisites(data: ICreateRequisites): Promise<void> {
	try {
		await prisma.requisites.create({
			data: data
		});

		revalidatePath('/requisites');
	} catch (error) {
		console.error('Error creating requisites:', error);
		throw new Error('Error creating requisites');
	}
}

export async function updateRequisites(data: IUpdateRequisites): Promise<void> {
	try {
		await prisma.requisites.update({
			where: {
				id: data.id,
			},
			data: data
		});

		revalidatePath('/requisites');
	} catch (error) {
		console.error('Error creating requisites:', error);
		throw new Error('Error updating requisites');
	}
}

export async function deleteRequisites(id: number): Promise<void> {
	try {
		await prisma.requisites.delete({
			where: {
				id: id
			}
		});

		revalidatePath('/requisites');
	} catch (error) {
		console.error('Error deleting requisites:', error);
		throw new Error('Error deleting requisites');
	}
}

export async function changeStatus(id: number, status: boolean): Promise<void> {
	try {
		await prisma.requisites.update({
			where: {
				id: id
			},
			data: {
				status: status
			}
		});
	} catch (error) {
		console.error('Error changing requisites status:', error);
		throw new Error('Error changing requisites status');
	}
}

