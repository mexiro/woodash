import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'

const protectedRoutes = ['/dashboard', '/orders', '/invoices', '/products', '/customers', '/settings']

export async function middleware(request) {
  const { pathname } = request.nextUrl

  // Always allow auth endpoints and static assets
  if (
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next()
  }

  // NextAuth v5 changed the cookie name from "next-auth.session-token" (v4)
  // to "authjs.session-token". On HTTPS (Vercel) it gets a __Secure- prefix.
  // Detect which cookie is actually present so getToken finds it.
  const secureCookie = '__Secure-authjs.session-token'
  const plainCookie  = 'authjs.session-token'
  const cookieName = request.cookies.has(secureCookie) ? secureCookie : plainCookie

  // Accept AUTH_SECRET (used in lib/auth.js) or NEXTAUTH_SECRET as fallback
  const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET

  const token = await getToken({ req: request, secret, cookieName })
  const isLoggedIn = !!token

  // Root redirect
  if (pathname === '/') {
    return NextResponse.redirect(
      new URL(isLoggedIn ? '/dashboard' : '/login', request.url)
    )
  }

  // Login page: allow through; redirect away if already logged in
  if (pathname === '/login') {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  // Protected routes: redirect to login if unauthenticated
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route))
  if (isProtected && !isLoggedIn) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
