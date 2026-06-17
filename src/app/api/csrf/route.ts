import { NextResponse } from 'next/server';
import { generateCsrfToken } from '@/lib/csrf';

// API endpoint to get a fresh CSRF token
// Frontend calls this before making order requests
export async function GET() {
  const token = await generateCsrfToken();
  return NextResponse.json({ csrf_token: token });
}
