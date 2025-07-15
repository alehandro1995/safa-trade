"use server";
import {prisma} from "@/client";
import {Group} from "../../generated/prisma";
import { randomBytes } from "crypto";

export async function addGroup(prevState: any, formData: FormData): Promise<{ status: 'error' | 'success' }> {
	try {
		const email = formData.get("email") as string;
		if (!email) {
			throw new Error('Email is required');
		}

		const user = await prisma.user.findUnique({
			where: {
				email: email,
			}
		});

		if (!user) {
			throw new Error('User not found');
		}

		const name = formData.get("name") as string;
		if (!name) {
			throw new Error('Name is required');
		}

		const token = randomBytes(16).toString('hex');
		const group = await prisma.group.create({
			data: {
				token: token,
				name: name,
				userId: user.id,
			}
		});
		
		if (!group) {
			throw new Error('Group creation failed');
		}

		return { status: 'success' }
	} catch (error) {
		console.error('Ошибка при добавлении группы:', error);
		return { status: 'error' }
	}
}

export async function getGroups(email: string): Promise<Group[]> {
	try {
		const user = await prisma.user.findUnique({
			where: {
				email: email,
			}
		});

		if (!user) {
			throw new Error('User not found');
		}

		const groups = await prisma.group.findMany({
			where: {
				userId: user.id,
			}
		});

		return groups;
	} catch (error) {
		console.error('Ошибка при получении групп:', error);
		return [];
	}
}

export async function deleteGroup(id: number): Promise<{ status: 'error' | 'success' }> {
	try {
		await prisma.group.delete({
			where: {
				id: id,
			}
		});

		return { status: 'success' }
	} catch (error) {
		console.error('Ошибка при удалении группы:', error);
		return { status: 'error'}
	}
}