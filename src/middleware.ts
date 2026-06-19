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

// Paths that require admin basic auth (CRITICAL — was publicly accessible)
const ADMIN_PATHS = [
  '/wa-autoreply/admin-crm',
  '/wa-autoreply/admin-crm.html',
];

function checkBasicAuth(request: NextRequest): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || expected.length < 8) {
    // Fail-closed: if env not set or weak, deny all access
    return false;
  }
  const authHeader = request.headers.get('authorization') || '';
  if (!authHeader.startsWith('Basic ')) return false;
  const encoded = authHeader.slice(6).trim();
  let decoded = '';
  try {
    decoded = atob(encoded);
  } catch {
    return false;
  }
  const idx = decoded.indexOf(':');
  if (idx < 0) return false;
  const pw = decoded.slice(idx + 1);
  // Constant-time-ish compare (avoid timing attacks on short strings)
  if (pw.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < pw.length; i++) {
    diff |= pw.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ua = (request.headers.get('user-agent') || '').toLowerCase();

  // Admin basic auth gate
  if (ADMIN_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'))) {
    if (!checkBasicAuth(request)) {
      return new NextResponse('Authentication required', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="WA AutoReply Admin", charset="UTF-8"',
          'X-Content-Type-Options': 'nosniff',
          'Cache-Control': 'no-store, no-cache, must-revalidate, private',
        },
      });
    }
  }

  // Block bot UAs on protected endpoints
  if (PROTECTED_PATHS.some(p => pathname.startsWith(p))) {
    if (!ua || ua.length < 10) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }
    if (BLOCKED_UAS.some(blocked => ua.includes(blocked))) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
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
    '/wa-autoreply/admin-crm/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
