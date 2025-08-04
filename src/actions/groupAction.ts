"use server";
import {prisma} from "@/client";
import {Group} from "@/generated/prisma";
import { randomBytes } from "crypto";
import { cookies } from "next/headers";

export async function addGroup(name:string): Promise<Group> {
	const cookiesStore = await cookies();
	const email = cookiesStore.get('email')?.value;
	if (!email) {
		console.error('Email cookie not found');
		throw new Error('Email cookie not found');
	}

	try {
		const user = await prisma.user.findUnique({
			where: {
				email: email,
			}
		});

		if (!user) {
			throw new Error('User not found');
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
			throw new Error('Failed to create group');
		}
		
		return group;
	} catch (error) {
		console.error('Ошибка при добавлении группы:', error);
		throw new Error('Ошибка при добавлении группы');
	}
}

export async function getGroups(): Promise<Group[]> {
	try {
		const cookiesStore = await cookies();
		const email = cookiesStore.get('email')?.value;
		if (!email) {
			console.error('Email cookie not found');
			throw new Error('Email cookie not found');
		}

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
		throw new Error('Ошибка при получении групп');
	}
}

export async function deleteGroup(id: number): Promise<void> {
	const cookiesStore = await cookies();
	const email = cookiesStore.get('email')?.value;
	if (!email) {
		console.error('Email cookie not found');
		throw new Error('Email cookie not found');
	}

	try {
		await prisma.group.delete({
			where: {
				id: id,
			}
		});

	} catch (error) {
		console.error('Ошибка при удалении группы:', error);
		throw new Error('Ошибка при удалении группы');
	}
}