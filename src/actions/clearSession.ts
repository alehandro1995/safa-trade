'use server'
import { cookies } from 'next/headers'
 
export async function deleteSession() {
  const cookie = await cookies();
  cookie.delete('session');
  cookie.delete('email');
}