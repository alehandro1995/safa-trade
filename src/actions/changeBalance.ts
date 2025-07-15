"use server";
import {prisma} from "@/client";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function changeBalance(prevState: any, formData: FormData) {

  const id = formData.get("id") as string;
  const balance = formData.get('balance') as string;

  if (!id || !balance) {
    return { message: 'Обязательное поле' }
  }

  prisma.user.update({
    where: {
      id: Number(id)
    },
    data: {
      balance: Number(balance)
    }
  }).then(() => {
    return { message: 'Баланс обновлен' }
  }).catch((err) => {
    console.log(err);
    return { message: 'Ошибка' }
  })
  
  revalidatePath("/admin");
  redirect("/admin")
}