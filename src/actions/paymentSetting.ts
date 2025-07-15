"use server";
import {prisma} from "@/client";
import { cookies } from "next/headers";

export async function paymentSetting(prevState: any, formData: FormData): Promise<{ message: string }> {
	const cookie = await cookies();
	const email = cookie.get("email")?.value;
	if (!email) {
		throw new Error("Пользователь не авторизован");
	}

	const user = await prisma.user.findFirst({
		where: {
			email: email
		}
	});

	if (!user) {
		throw new Error("Пользователь не найден");
	}

	const minOrder = formData.get("min_order") as string;
	const maxOrder = formData.get("max_order") as string;
	const currency = formData.get('currency') as string;
	const bank = formData.get("bank") as string;
	const payment = formData.get("payment") as string;
	//const isDivisible = formData.get("divisible") === "on";
	//const onlyMir = formData.get("only_mir") === "on";

	if (!minOrder || !maxOrder || !currency || currency === "0" || !bank || bank === "0" || !payment || payment === "0") {
		return { message: "error" };
	}

	await prisma.paymentSetting.upsert({
		where: {
			userId: user.id,
		},
		update: {
			minOrder: parseFloat(minOrder),
			maxOrder: parseFloat(maxOrder),
			currencyId: parseInt(currency),
			bankId: parseInt(bank),
			paymentId: parseInt(payment),
		},
		create: {
			userId: user.id,
			minOrder: parseFloat(minOrder),
			maxOrder: parseFloat(maxOrder),
			currencyId: parseInt(currency),
			bankId: parseInt(bank),
			paymentId: parseInt(payment),
		},
	}).catch((error) => {
		console.error("Ошибка при сохранении настроек платежа:", error);
		throw new Error("Не удалось сохранить настройки платежа. Пожалуйста, попробуйте позже.");
	});

	return { message: "success" };
}