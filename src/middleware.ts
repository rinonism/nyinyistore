import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Bot/UA blocking + basic security headers
const BLOCKED_UAS = [
  'curl', 'wget', 'python-requests', 'httpie', 'postman',
  'insomnia', 'axios', 'node-fetch', 'go-http-client',
  'java/', 'libwww', 'scrapy', 'bot', 'spider', 'crawl',
];

// Paths that require browser UA (order endpoints)
const PROTECTED_PATHS = [
  '/api/orders/create-tripay',
  '/api/order/create',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ua = (request.headers.get('user-agent') || '').toLowerCase();

  // Block bot UAs on protected endpoints
  if (PROTECTED_PATHS.some(p => pathname.startsWith(p))) {
    // No UA = block
    if (!ua || ua.length < 10) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Known bot/tool UAs = block
    if (BLOCKED_UAS.some(blocked => ua.includes(blocked))) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }
  }

  // Security headers for all responses
  const response = NextResponse.next();
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
