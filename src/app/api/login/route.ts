import 'server-only'
import { cookies } from 'next/headers'
import {prisma} from "@/client";
import type { User } from "@/generated/prisma";
import { encrypt } from "@/lib/session";

export async function POST(request: Request) {
	
  const formData = await request.formData();
  const email = formData.get('email');
  const password = formData.get('password');
  if (!email){
    return new Response("Email is required", { status: 500 });
  }
  const user = await prisma.user.findFirst({where: {email: email as string}}) as User;
  if (!user){
    return new Response("User not found", { status: 400 });
  }
  if (user.password !== password){
    return new Response("Password or login is incorrect", { status: 400 });
  }

  const expiresAt = new Date(Date.now() + 60 * 60 * 1000)
  const session = await encrypt({email: user.email, role: user.role});
  const cookieStore = await cookies()
  cookieStore.set('session', session, {
    httpOnly: true,
    expires: expiresAt,
    path: '/',
  });
  
  return Response.json({
    email: user.email,  
    balance: user.balance
  });  
}