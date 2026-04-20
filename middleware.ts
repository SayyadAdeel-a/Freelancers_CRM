import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const session = request.cookies.get("session");
  const isAuthPage = request.nextUrl.pathname.startsWith("/login") ||
                     request.nextUrl.pathname.startsWith("/signup") ||
                     request.nextUrl.pathname.startsWith("/forgot-password");
  const isDashboardPage = request.nextUrl.pathname.startsWith("/dashboard") ||
                          request.nextUrl.pathname.startsWith("/settings");

  if (isDashboardPage && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthPage && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/settings/:path*", "/login", "/signup", "/forgot-password"],
};