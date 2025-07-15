import { NextRequest, NextResponse } from 'next/server'
import { decrypt } from './lib/session'
import { cookies } from 'next/headers'
 
export default async function middleware(req: NextRequest) {

  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)
  // 4. Redirect to /login if the user is not authenticated
  if (!session?.email || !session?.role) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  if(req.nextUrl.pathname.startsWith('/admin') && session.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  const email = session.email as string
  const response = NextResponse.next()
  response.cookies.set('email', email)
  return response;
}
 
// Routes Middleware should not run on
export const config = {
  matcher: [
    "/", 
    "/statistic", 
    "/history", 
    "/deals", 
    "/requisites", 
    "/settings", 
    "/admin", 
    "/admin/create"
  ],
};