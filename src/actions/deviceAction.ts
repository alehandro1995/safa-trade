"use server";
import {prisma} from "@/client";
import {Device} from "../../generated/prisma";
import { randomBytes } from "crypto";

export async function addDevice(prevState: any, formData: FormData): Promise<{ status: 'error' | 'success' }> {
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
			throw new Error('Device name is required');
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

		console.log('Device added:', device);
		return { status: 'success' }
	} catch (error) {
		console.error('Error adding device:', error);
		return { status: 'error' }
	}
}

export async function getDevices(email: string): Promise<Device[]> {
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
		return [];
	}
}

export async function deleteDevice(deviceId: string): Promise<{ status: 'success' | 'error' }> {
	try {
		const device = await prisma.device.delete({
			where: {
				deviceId: deviceId,
			}
		});

		if (!device) {
			throw new Error('Device not found');
		}

		return { status: 'success' }
	} catch (error) {
		console.error('Error deleting device:', error);
		return { status: 'error' }
	}
}