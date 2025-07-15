import {prisma} from "@/client";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  const formData = await request.formData();
  const id = formData.get('id');
  const password = formData.get('password') as string;
  if (!password || !id){
    return new Response("Bad request", { status: 500 });
  }
  
  try{
    await prisma.user.update({
      where: {
        id: Number(id)
      },
      data: {
        password: password,
        status: true
      }
    });

    revalidatePath("/admin");
  }
  catch(e){
    return new Response("Bad request", { status: 500 });
  }

  return new Response("Logged in", { status: 200 });  
}