import { randomBytes } from 'crypto';
import { cookies } from 'next/headers';

const CSRF_COOKIE = 'csrf_token';
const CSRF_HEADER = 'x-csrf-token';
const TOKEN_TTL = 3600 * 1000; // 1 hour

interface TokenData {
  token: string;
  expires: number;
}

// Generate a new CSRF token and set it as a cookie
export async function generateCsrfToken(): Promise<string> {
  const token = randomBytes(32).toString('hex');
  const cookieStore = await cookies();
  
  const data: TokenData = {
    token,
    expires: Date.now() + TOKEN_TTL,
  };

  cookieStore.set(CSRF_COOKIE, JSON.stringify(data), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 3600, // 1 hour
  });

  return token;
}

// Validate CSRF token from request header against cookie
export async function validateCsrfToken(request: Request): Promise<boolean> {
  const headerToken = request.headers.get(CSRF_HEADER);
  if (!headerToken) return false;

  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(CSRF_COOKIE)?.value;
  if (!cookieValue) return false;

  try {
    const data: TokenData = JSON.parse(cookieValue);
    
    // Check expiry
    if (Date.now() > data.expires) return false;
    
    // Constant-time comparison
    if (data.token.length !== headerToken.length) return false;
    
    let mismatch = 0;
    for (let i = 0; i < data.token.length; i++) {
      mismatch |= data.token.charCodeAt(i) ^ headerToken.charCodeAt(i);
    }
    
    return mismatch === 0;
  } catch {
    return false;
  }
}
