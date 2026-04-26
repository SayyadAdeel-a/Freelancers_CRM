import { NextResponse, type NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const session = request.cookies.get('session');
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname === '/login' || pathname === '/signup' || pathname === '/forgot-password';
  const isDashboardPage = pathname.startsWith('/dashboard') || pathname.startsWith('/settings');

  // 1. If trying to access dashboard/settings WITHOUT a session, redirect to login
  if (isDashboardPage && !session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. If trying to access login/signup WITH a session, redirect to dashboard
  if (isAuthPage && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/settings/:path*',
    '/login',
    '/signup',
    '/forgot-password',
  ],
};
