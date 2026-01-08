import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the request is for dashboard routes
  if (pathname.startsWith('/dashboard')) {
    // Try to get token from cookies or Authorization header
    const token = request.cookies.get('auth-token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '');

    // If no token, redirect to login
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Token exists, let the client-side handle verification
    // Just pass through to the dashboard layout which will handle auth verification
    return NextResponse.next();
  }

  // For auth routes, check if token exists (basic check)
  if (pathname === '/login' || pathname === '/register') {
    const token = request.cookies.get('auth-token')?.value;
    
    // If token exists, redirect to dashboard (client will verify if it's valid)
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/register'
  ]
};