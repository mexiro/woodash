export const runtime = 'nodejs'
import { auth } from './lib/auth'

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const pathname = req.nextUrl.pathname
  const isLoginPage = pathname === '/login'

  if (!isLoggedIn && !isLoginPage) {
    return Response.redirect(new URL('/login', req.nextUrl.origin))
  }

  if (isLoggedIn && isLoginPage) {
    return Response.redirect(new URL('/dashboard', req.nextUrl.origin))
  }
})

export const config = {
  // Protect all routes except API routes, Next.js internals, and static files
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
