import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-change-in-production-32chars'
)

const PROTECTED_PATHS = ['/dashboard', '/pbs', '/profile']
const AUTH_PATHS = ['/login', '/signup']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('gym-world-auth')?.value

  const isProtected = PROTECTED_PATHS.some(p => pathname.startsWith(p))
  const isAuthPage = AUTH_PATHS.some(p => pathname.startsWith(p))

  if (isProtected) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    try {
      await jwtVerify(token, JWT_SECRET)
    } catch {
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.delete('gym-world-auth')
      return response
    }
  }

  // If logged in and hitting auth pages, redirect to dashboard
  if (isAuthPage && token) {
    try {
      await jwtVerify(token, JWT_SECRET)
      return NextResponse.redirect(new URL('/dashboard', request.url))
    } catch {
      // Invalid token — let them through to auth pages
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/pbs/:path*', '/profile/:path*', '/login', '/signup'],
}
