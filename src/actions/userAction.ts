"use server";
import {prisma} from "@/client";
import { randomBytes } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import type { IUserInfo } from "@/types/User";
import type { TransactionType } from "@/generated/prisma";
import { deleteSession } from "@/lib/session";

export async function createUser(prevState: any, formData: FormData): Promise<{ message: 'success' | 'error' }> {

  const email = formData.get("email") as string;
  if (!email) {
    throw new Error("Error creating user, email is required");
  }

	try{
		const userExists = await prisma.user.findFirst({
			where: {
				email: email
			}
		});

		if (userExists) {
			return { message: 'error' }
		}

		const balance = formData.get("balance") as string;
		const payInGambling = formData.get("payInGambling") as string;
		const payInExchangers = formData.get("payInExchangers") as string;
		const payOutGambling = formData.get("payOutGambling") as string;
		const payOutExchangers = formData.get("payOutExchangers") as string;

		await prisma.user.create({
			data: {
				email: email,
				inviteToken: randomBytes(12).toString("hex"),
				balance: parseFloat(balance) || 0,
				payInGambling: parseFloat(payInGambling) || 0,
				payInExchangers: parseFloat(payInExchangers) || 0,
				payOutGambling: parseFloat(payOutGambling) || 0,
				payOutExchangers: parseFloat(payOutExchangers) || 0
			}
		});

		revalidatePath("/admin");
		return { message: 'success' };
	} catch (error) {
		console.error("Error creating user:", error);
		throw new Error("Error creating user, please try again later.");
	}
}

export async function updateUser(prevState: any, formData: FormData): Promise<{ message: 'success' | 'error' }> {
	const email = formData.get("email") as string;
	const balance = formData.get("balance") as string;
	const payInGambling = formData.get("payInGambling") as string;
	const payInExchangers = formData.get("payInExchangers") as string;
	const payOutGambling = formData.get("payOutGambling") as string;
	const payOutExchangers = formData.get("payOutExchangers") as string;

	if (!email) {
		throw new Error("Email is required");
	}
	
	try {
		await prisma.user.update({
			where: {
				email: email
			},
			data: {
				balance: parseFloat(balance),
				payInGambling: parseFloat(payInGambling),
				payInExchangers: parseFloat(payInExchangers),
				payOutGambling: parseFloat(payOutGambling),
				payOutExchangers: parseFloat(payOutExchangers)
			}
		});
	} catch (error) {
		console.error(error);
		return { message: "error" };
	}
	
	revalidatePath(`/admin`);
	return { message: "success" };
}

export async function changePassword(password: string): Promise<void> {
	const cookie = await cookies();
	const email = cookie.get("email")?.value;
	if (!email) {
		throw new Error("User not authenticated");
	}

	try{
		await prisma.user.update({
			where: {
				email: email
			},
			data: {
				password: password
			}
		});
	} catch (error) {
		throw new Error("Error changing password");
	}
}

export async function changeUserStatus(type: TransactionType, status:boolean): Promise<void> {
	const cookie = await cookies();
	const email = cookie.get("email")?.value;
	if (!email) {
		throw new Error("User not authenticated");
	}

	const transformType = type.toLowerCase() as "payment" | "receive";
	console.log(`Changing user status: ${transformType} to ${status} for email: ${email}`);
	try{
		await prisma.user.update({
			where: {
				email: email
			},
			data: {
				[`${transformType}Status`]: status
			}
		});
	} catch (error) {
		console.error("Error updating user status:", error);
		throw new Error("Error updating user status, please try again later.");
	}
}

export async function withdraw(amount: number): Promise<void> {
	const cookie = await cookies();
	const email = cookie.get("email")?.value;
	if (!email) {
		throw new Error("User not authenticated");
	}

	try {
		await prisma.user.update({
			where: { email },
			data: {
				balance: {
					decrement: amount
				}
			}
		});
	} catch (error) {
		console.error("Error withdrawing funds:", error);
		throw new Error("Error withdrawing funds, please try again later.");
	}
}

export async function addBalance(formData: FormData): Promise<void> {
	const email = formData.get("email") as string;
	if (!email) {
		throw new Error("Email is required to add balance");
	}
	const amount = formData.get("amount") as string;
	if (!amount) {
		throw new Error("Amount is required");
	}

	console.log(`Adding balance: ${amount} to user: ${email}`);

	try {
		await prisma.user.update({
			where: { email },
			data: {
				balance: {
					increment: parseFloat(amount)
				}
			}
		});
	} catch (error) {
		console.error("Error adding balance:", error);
		throw new Error("Error adding balance, please try again later.");
	}

	revalidatePath("/admin");
	redirect("/admin");
}

export async function deleteUser(email: string): Promise<void> {
	try {
		
		const user = await prisma.user.findFirst({
			where: {
				email: email
			}
		});

		if (!user) {
			throw new Error("User not found");
		}

		prisma.$transaction(async (tx) => {
			await tx.device.deleteMany({
				where: {
					userId: user.id
				}
			});

			await tx.group.deleteMany({
				where: {
					userId: user.id
				}
			});

			await tx.requisites.deleteMany({
				where: {
					userId: user.id
				}
			});

			await tx.transaction.deleteMany({
				where: {
					userId: user.id
				}
			});

			await tx.user.delete({
				where: {
					id: user.id
				}
			});
		});
	} catch (error) {
		throw new Error("Error deleting user: " + error);
	}

	revalidatePath("/admin");
}

export async function getUser(): Promise<IUserInfo | null> {
	const cookie = await cookies();
	const email = cookie.get("email")?.value;
	if (!email) {
		throw new Error("Email is required to fetch user");
	}

	const user = await prisma.user.findUnique({
		select: {
			id: true,
			email: true,
			balance: true,
			fundsBlocked: true,
			payInGambling: true,
			payInExchangers: true,
			payOutGambling: true,
			payOutExchangers: true,
			paymentStatus: true,
			receiveStatus: true
		},
		where: {
			email: email
		}
	});

	return user;
}

export async function logout() {
	await deleteSession();
	redirect('/login');
}
