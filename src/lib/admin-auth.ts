import { SignJWT, jwtVerify } from "jose";
import { NextRequest } from "next/server";

// JWT secret MUST be set explicitly — never fallback to password or weak default
const jwtSecret = process.env.ADMIN_JWT_SECRET;
if (!jwtSecret) {
  console.error("FATAL: ADMIN_JWT_SECRET env var is not set. Admin auth will fail.");
}
const SECRET = new TextEncoder().encode(jwtSecret || "MISSING-JWT-SECRET-SET-ENV-VAR");

const TOKEN_EXPIRY = "24h";

export async function createAdminToken(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(SECRET);
}

export async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, SECRET);
    return true;
  } catch {
    return false;
  }
}

export async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get("admin_token")?.value;
  if (!token) return false;
  return verifyAdminToken(token);
}
