import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { pickHomeByRole } from "@/lib/rbac";

const PUBLIC_EXACT = new Set([
  "/",
  "/login",
  "/forgot-password",
  "/403",
]);
const PUBLIC_PREFIXES: string[] = [];

const AUTH_COOKIES = ["auth_token", "api_token", "refresh_token", "token_exp"] as const;

const secret = process.env.JWT_SECRET;
if (!secret) throw new Error("Missing JWT_SECRET");
const JWT_SECRET = new TextEncoder().encode(secret);

function isPublicPath(pathname: string) {
  if (PUBLIC_EXACT.has(pathname)) return true;
  return PUBLIC_PREFIXES.some((p) => pathname.startsWith(p + "/"));
}

function pathStarts(pathname: string, base: string) {
  return pathname === base || pathname.startsWith(base + "/");
}

function clearSession(res: NextResponse) {
  for (const name of AUTH_COOKIES) {
    res.cookies.set(name, "", { maxAge: 0, path: "/" });
  }
  return res;
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get("auth_token")?.value ?? null;
  const refreshToken = request.cookies.get("refresh_token")?.value ?? null;

  if (isPublicPath(pathname)) {
    if (pathname !== "/403" && token) {
      try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        const role = typeof payload.role === "string" ? payload.role : "";
        if (role) {
          const homeUrl = new URL(pickHomeByRole(role), request.url);
          return NextResponse.redirect(homeUrl);
        }
      } catch {}
    }
    return NextResponse.next();
  }

  const destination = pathname + (search || "");

  if (!token) {
    // No auth_token at all
    if (refreshToken) {
      // Try silent refresh — redirect to the refresh route handler, which re-issues
      // cookies and bounces back. This must point at /api/auth/refresh: the actual
      // handler lives at src/app/api/auth/refresh/route.ts, not a page route.
      const refreshUrl = new URL("/api/auth/refresh", request.url);
      refreshUrl.searchParams.set("redirect", destination);
      return NextResponse.redirect(refreshUrl);
    }
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", destination);
    loginUrl.searchParams.set("reason", "expired");
    return NextResponse.redirect(loginUrl);
  }

  let payload: any;
  try {
    ({ payload } = await jwtVerify(token, JWT_SECRET));
  } catch (err) {
    // auth_token expired or invalid
    if (refreshToken) {
      // Silent refresh
      const refreshUrl = new URL("/api/auth/refresh", request.url);
      refreshUrl.searchParams.set("redirect", destination);
      const res = NextResponse.redirect(refreshUrl);
      // Clear expired auth_token so the next request doesn't loop
      res.cookies.set("auth_token", "", { maxAge: 0, path: "/" });
      return res;
    }
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", destination);
    loginUrl.searchParams.set("reason", "expired");
    return clearSession(NextResponse.redirect(loginUrl));
  }

  const role = payload.role;
  const approval_level = payload.approval_level || 0;

  if (!role) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("reason", "expired");
    return clearSession(NextResponse.redirect(loginUrl));
  }

  const forbid = () => NextResponse.redirect(new URL("/403", request.url));

  // /organizer/dashboard/user - สำหรับ role นอกเหนือจาก hr, director, admin
  if (pathStarts(pathname, "/organizer/dashboard/user")) {
    if (["hr", "director", "admin"].includes(role)) return forbid();
  }
  
  
  // /organizer/dashboard/director - สำหรับ role code "director"
  if (pathStarts(pathname, "/organizer/dashboard/director") && role !== "director") {
    return forbid();
  }

  // /organizer/qa-coverage - สำหรับ director
  if (pathStarts(pathname, "/organizer/qa-coverage") && role !== "director") {
    return forbid();
  }

  // /organizer/projects/my-project - ห้าม hr, admin
  if (pathStarts(pathname, "/organizer/projects/my-project")) {
    if (["hr", "admin"].includes(role)) return forbid();
  }

  // /organizer/approve/ - สำหรับคนที่มี approval_level > 0
  if (pathStarts(pathname, "/organizer/approve/")) {
    if (approval_level <= 0) return forbid();
  }

  // /organizer/reports/ - ห้าม hr, admin, planning
  if (pathStarts(pathname, "/organizer/reports/")) {
    if (["hr", "admin", "planning"].includes(role)) return forbid();
  }

  // /organizer/department - ต้องเป็น hr, admin หรือ director
  if (pathStarts(pathname, "/organizer/department")) {
    if (!["hr", "admin", "director"].includes(role)) return forbid();
  }

  // /admin - ต้องเป็น admin
  if (pathStarts(pathname, "/admin") && role !== "admin") {
    return forbid();
  }

  const headers = new Headers(request.headers);
  if (payload.sub) headers.set("x-user-id", payload.sub);
  if (payload.role) headers.set("x-user-role", payload.role);
  if (payload.name) headers.set("x-user-name", payload.name);
  if (payload.org_id) headers.set("x-org-id", payload.org_id);
  if (payload.department_id) headers.set("x-dept-id", payload.department_id);
  if (payload.approval_level !== undefined) headers.set("x-approval-level", String(payload.approval_level));

  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: [
    "/((?!_next|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)|api).*)",
  ],
};
