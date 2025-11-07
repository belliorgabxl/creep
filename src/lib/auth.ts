import { jwtVerify, SignJWT, decodeJwt } from "jose";
import { cookies } from "next/headers";

export interface UserPayload {
  sub: string;
  username: string;
  role?: string;
  name?: string;
  org_id?: string;
  department_id?: string;
  iat?: number;
  exp?: number;
}

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET 
);

// เซ็น JWT ของฝั่งเราเอง
export async function signUserToken(user: Omit<UserPayload, "iat" | "exp">, ttlSec: number) {
  const now = Math.floor(Date.now() / 1000);
  return await new SignJWT({ ...user, iat: now, exp: now + ttlSec })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .sign(JWT_SECRET);
}

export async function verifyAuth(token: string): Promise<UserPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as UserPayload;
  } catch {
    return null;
  }
}

// ดึง user ปัจจุบันจาก auth_token (ของเราเอง)
export async function getCurrentUser(): Promise<UserPayload | null> {
  const jar = await cookies();
  const token = jar.get("auth_token")?.value;
  if (!token) return null;
  return await verifyAuth(token);
}

// ถอด payload จาก external JWT (ไม่ verify)
export function decodeExternalJwt<T = any>(token: string): T | null {
  try {
    return decodeJwt(token) as unknown as T;
  } catch {
    return null;
  }
}
