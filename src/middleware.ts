import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const PUBLIC_PATHS = ["/", "/login", "/forgot-password"];

interface TokenPayload {
  sub: string;
  username: string;
  role: string;
  name: string;
  iat: number;
  exp: number;
}

async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "your-secret-key-min-32-characters-long"
    );
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as TokenPayload;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

function pickHomeByRole(role?: string): string {
  if (role === "admin") return "/admin";
  return "/user/dashboard";
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // ตรวจสอบว่าเป็น public path หรือไม่
  if (PUBLIC_PATHS.includes(pathname)) {
    // ถ้า login แล้วพยายามเข้า public path ให้ redirect ไปหน้าหลัก
    const token = request.cookies.get("auth_token")?.value;
    if (token) {
      const payload = await verifyToken(token);
      if (payload) {
        const homeUrl = new URL(pickHomeByRole(payload.role), request.url);
        return NextResponse.redirect(homeUrl);
      }
    }
    return NextResponse.next();
  }

  // ตรวจสอบ token
  const token = request.cookies.get("auth_token")?.value;

  if (!token) {
    // ไม่มี token ให้ redirect ไป login
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname + (search || ""));
    return NextResponse.redirect(loginUrl);
  }

  // Verify token
  const payload = await verifyToken(token);

  if (!payload) {
    // Token ไม่ valid ให้ลบ cookies และ redirect ไป login
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("auth_token");
    response.cookies.delete("user_role");
    return response;
  }

  // ตรวจสอบ role-based access
  if (pathname.startsWith("/admin") && payload.role !== "admin") {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname + (search || ""));
    const response = NextResponse.redirect(loginUrl);
    return response;
  }

  if (pathname.startsWith("/user") && payload.role !== "user") {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname + (search || ""));
    const response = NextResponse.redirect(loginUrl);
    return response;
  }

  // เพิ่ม user info ใน request headers สำหรับใช้ใน API routes
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-user-id", payload.sub);
  requestHeaders.set("x-user-role", payload.role);
  requestHeaders.set("x-user-name", payload.name);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    "/((?!_next|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)|api/auth).*)",
  ],
};