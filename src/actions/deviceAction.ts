"use server";
import {prisma} from "@/client";
import {Device} from "@/generated/prisma";
import { randomBytes } from "crypto";
import { cookies } from "next/headers";

export async function addDevice(name: string): Promise<Device> {
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

		const deviceId = randomBytes(16).toString('hex');
		const device = await prisma.device.create({
			data: {
				deviceId: deviceId,
				name: name,
				userId: user.id,
			}
		});
		
		if (!device) {
			throw new Error('Failed to create device');
		}

		return device;
	} catch (error) {
		console.error('Error adding device:', error);
		throw new Error('Error adding device');
	}
}

export async function getDevices(): Promise<Device[]> {
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

		const devices = await prisma.device.findMany({
			where: {
				userId: user.id,
			}
		});

		return devices;
	} catch (error) {
		console.error('Error fetching devices:', error);
		throw new Error('Error fetching devices');
	}
}

export async function deleteDevice(id: number): Promise<void> {
	const cookiesStore = await cookies();
	const email = cookiesStore.get('email')?.value;
	if (!email) {
		console.error('Email cookie not found');
		throw new Error('Email cookie not found');
	}
	
	try {
		await prisma.device.delete({
			where: {
				id: id,
			}
		});
	} catch (error) {
		console.error('Error deleting device:', error);
		throw new Error('Error deleting device');
	}
}