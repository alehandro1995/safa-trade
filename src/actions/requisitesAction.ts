"use server";
import {prisma} from "@/client";
import { revalidatePath } from "next/cache";

export async function createRequisites(prevState: any, formData: FormData): Promise<{ status: 'error' | 'success' }> {
	try {
		const email = formData.get('email') as string;
		if (!email) {
			throw new Error('Email is required');
		}

		const user = await prisma.user.findUnique({
			where: {
				email: email
			}
		});

		if (!user) {
			throw new Error('User not found');
		}

		const currencyId = formData.get('currency') as string;
		if (!currencyId) {
			throw new Error('Currency is required');
		}

		const bankId = formData.get('bank') as string;
		if (!bankId) {
			throw new Error('Bank name is required');
		}

		const paymentId = formData.get('payment') as string;
		if (!paymentId) {
			throw new Error('Payment method is required');
		}

		const cardNumber = formData.get('card_number') as string;
		if (!cardNumber) {
			throw new Error('Card number is required');
		}

		const cardOwner = formData.get('owner_name') as string;
		if (!cardOwner) {
			throw new Error('Owner name is required');
		}

		const card = formData.get('card') as string;
		if (!card) {
			throw new Error('Card type is required');
		}

		const group = formData.get('group') as string;
		let groupId = group !== '0' ? parseInt(group) : null;

		const device = formData.get('device') as string;
		let deviceId = device !== '0' ? parseInt(device) : null;

		const result = await prisma.requisites.create({
			data: {
				userId: user.id,
				currencyId: parseInt(currencyId),
				bankId: parseInt(bankId),
				paymentId: parseInt(paymentId),
				cardNumber: cardNumber,
				cardOwner: cardOwner,
				card: card,
				groupId: groupId,
				deviceId: deviceId,
				minOrder: parseInt(formData.get('min_order') as string),
				maxOrder: parseInt(formData.get('max_order') as string),
				dayLimit: parseInt(formData.get('day_limit') as string),
				monthLimit: parseInt(formData.get('month_limit') as string),
				dayQuantity: parseInt(formData.get('day_quantity') as string),
				monthQuantity: parseInt(formData.get('month_quantity') as string),
				concurrentOrder: parseInt(formData.get('concurrent_order') as string),
				minutesDelay: parseInt(formData.get('minutes_delay') as string),
			}
		});

		revalidatePath('/requisites');
		return { status: 'success' }
	} catch (error) {
		console.error('Error creating requisites:', error);
		return { status: 'error' }
	}
}

export async function updateRequisites(prevState: any, formData: FormData): Promise<{ status: 'error' | 'success' }> {
	try {
		const id = formData.get('id') as string;
		if (!id) {
			throw new Error('Incorrect requisites ID');
		}

		const currencyId = formData.get('currency') as string;
		if (!currencyId) {
			throw new Error('Currency is required');
		}

		const bankId = formData.get('bank') as string;
		if (!bankId) {
			throw new Error('Bank name is required');
		}

		const paymentId = formData.get('payment') as string;
		if (!paymentId) {
			throw new Error('Payment method is required');
		}

		const cardNumber = formData.get('card_number') as string;
		if (!cardNumber) {
			throw new Error('Card number is required');
		}

		const cardOwner = formData.get('owner_name') as string;
		if (!cardOwner) {
			throw new Error('Owner name is required');
		}

		const card = formData.get('card') as string;
		if (!card) {
			throw new Error('Card type is required');
		}

		const group = formData.get('group') as string;
		let groupId = group !== '0' ? parseInt(group) : null;

		const device = formData.get('device') as string;
		let deviceId = device !== '0' ? parseInt(device) : null;

		const result = await prisma.requisites.update({
			where: {
				id: parseInt(id),
			},
			data: {
				currencyId: parseInt(currencyId),
				bankId: parseInt(bankId),
				paymentId: parseInt(paymentId),
				cardNumber: cardNumber,
				cardOwner: cardOwner,
				card: card,
				groupId: groupId,
				deviceId: deviceId,
				minOrder: parseInt(formData.get('min_order') as string),
				maxOrder: parseInt(formData.get('max_order') as string),
				dayLimit: parseInt(formData.get('day_limit') as string),
				monthLimit: parseInt(formData.get('month_limit') as string),
				dayQuantity: parseInt(formData.get('day_quantity') as string),
				monthQuantity: parseInt(formData.get('month_quantity') as string),
				concurrentOrder: parseInt(formData.get('concurrent_order') as string),
				minutesDelay: parseInt(formData.get('minutes_delay') as string),
			}
		});

		revalidatePath('/requisites');
		return { status: 'success' }
	} catch (error) {
		console.error('Error creating requisites:', error);
		return { status: 'error' }
	}
}

export async function deleteRequisites(id: number): Promise<{ status: 'error' | 'success' }> {
	try {
		const result = await prisma.requisites.delete({
			where: {
				id: id
			}
		});

		if (!result) {
			throw new Error('Requisite not found');
		}

		revalidatePath('/requisites');
		return { status: 'success' }
	} catch (error) {
		console.error('Error deleting requisites:', error);
		return { status: 'error' }
	}
}

export async function changeStatus(id: number, status: boolean): Promise<{ status: 'error' | 'success' }> {
	try {
		const result = await prisma.requisites.update({
			where: {
				id: id
			},
			data: {
				status: status
			}
		});

		if (!result) {
			throw new Error('Requisite not found');
		}

		revalidatePath('/requisites');
		return { status: 'success' }
	} catch (error) {
		console.error('Error changing requisites status:', error);
		return { status: 'error' }
	}
}

