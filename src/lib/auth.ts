// lib/auth.ts
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

export interface UserPayload {
  sub: string;
  username: string;
  role: string;
  name: string;
}

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-min-32-characters-long"
);

/**
 * ตรวจสอบและ decode JWT token
 */
export async function verifyAuth(token: string): Promise<UserPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as UserPayload;
  } catch (error) {
    return null;
  }
}

/**
 * ดึงข้อมูล user จาก cookie ใน Server Component
 */
export async function getCurrentUser(): Promise<UserPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) return null;

  return await verifyAuth(token);
}

/**
 * ตรวจสอบว่า user มี role ที่กำหนดหรือไม่
 */
export async function hasRole(allowedRoles: string[]): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;
  return allowedRoles.includes(user.role);
}

/**
 * ตรวจสอบว่า user login แล้วหรือยัง
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return !!user;
}