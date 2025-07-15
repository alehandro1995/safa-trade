"use server";
import {prisma} from "@/client";
import { randomBytes } from "crypto";
//import { redirect } from "next/navigation";
import type { User } from "../../generated/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function createUser(prevState: any, formData: FormData): Promise<{ message: 'success' | 'error' }> {

  const email = formData.get("email") as string;
  if (!email) {
    throw new Error("Error creating user")
  }

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

  const user:User = await prisma.user.create({
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

export async function changePassword(prevState: any, formData: FormData): Promise<{ message: string }> {
	const cookie = await cookies();
	const email = cookie.get("email")?.value;
	if (!email) {
		throw new Error("User not authenticated");
	}

	const password = formData.get("password") as string;
	const confirm = formData.get("confirm") as string;
	if (!password || !confirm) {
		throw new Error("Passwords do not match");
	}

	if (password !== confirm) {
		return { message: "error" };
	}

	await prisma.user.update({
		where: {
			email: email
		},
		data: {
			password: password
		}
	});

	return { message: "success" };
}

export async function deleteUser(email: string): Promise<void> {
	try {
		await prisma.user.delete({
			where: {
				email: email
			}
		});
	} catch (error) {
		throw new Error("Error deleting user: " + error);
	}

	revalidatePath("/admin");
}
