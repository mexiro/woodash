import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'

const protectedRoutes = ['/dashboard', '/orders', '/invoices', '/products', '/customers', '/settings']

export async function middleware(req) {
  const { pathname } = req.nextUrl

  // Always allow Next.js auth endpoints (must not be intercepted)
  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next()
  }

  const token = await getToken({ req, secret: process.env.AUTH_SECRET })
  const isLoggedIn = !!token

  // Root: redirect based on auth state
  if (pathname === '/') {
    return NextResponse.redirect(new URL(isLoggedIn ? '/dashboard' : '/login', req.url))
  }

  // Login page: allow through (redirect to dashboard if already logged in)
  if (pathname === '/login') {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
    return NextResponse.next()
  }

  // Protected routes: redirect to login if not authenticated
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route))
  if (isProtected && !isLoggedIn) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  // Exclude Next.js internals and static assets; everything else runs through middleware
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
