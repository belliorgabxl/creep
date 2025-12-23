
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { pickHomeByRole } from "@/lib/rbac";

const PUBLIC_PREFIXES = ["/", "/login", "/forgot-password"];
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

function isPublicPath(pathname: string) {
  return PUBLIC_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
}

function pathStarts(pathname: string, base: string) {
  return pathname === base || pathname.startsWith(base + "/");
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get("auth_token")?.value ?? null;

  if (isPublicPath(pathname)) {
    if (token) {
      try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        const homeUrl = new URL(pickHomeByRole(payload.role as string), request.url);
        return NextResponse.redirect(homeUrl);
      } catch {
      }
    }
    return NextResponse.next();
  }

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname + (search || ""));
    return NextResponse.redirect(loginUrl);
  }

  let payload: any;
  try {
    ({ payload } = await jwtVerify(token, JWT_SECRET));
  } catch (err) {
    try {
      const refreshRes = await fetch(new URL("/api/auth/refresh", request.url).toString(), {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
      });
      if (refreshRes.ok) {
        return NextResponse.next();
      } else {
        const res = NextResponse.redirect(new URL("/login", request.url));
        res.cookies.delete("auth_token");
        res.cookies.delete("api_token");
        res.cookies.delete("refresh_token");
        return res;
      }
    } catch {
      const res = NextResponse.redirect(new URL("/login", request.url));
      res.cookies.delete("auth_token");
      res.cookies.delete("api_token");
      res.cookies.delete("refresh_token");
      return res;
    }
  }
  const role = (payload.role as string) || "department_user";

  const forbid = () => NextResponse.redirect(new URL("/403", request.url));

  if (pathStarts(pathname, "/organizer/dashboard/user") && role !== "department_user") {
    return forbid();
  }
  if (pathStarts(pathname, "/organizer/dashboard/hr") && role !== "hr") {
    return forbid();
  }
  if (pathStarts(pathname, "/organizer/dashboard/director") && role !== "director") {
    return forbid();
  }

  if (pathStarts(pathname, "/organizer/qa-coverage")) {
    if (["department_user", "hr", "admin"].includes(role)) return forbid();
  }

  if (pathStarts(pathname, "/organizer/projects/my-project")) {
    if (["hr", "admin"].includes(role)) return forbid();
  }

  if (pathStarts(pathname, "/organizer/department")) {
    if (role !== "hr") return forbid();
  }

  if (pathStarts(pathname, "/admin") && role !== "admin") {
    return forbid();
  }

  const headers = new Headers(request.headers);
  if (payload.sub) headers.set("x-user-id", payload.sub);
  if (payload.role) headers.set("x-user-role", payload.role);
  if (payload.name) headers.set("x-user-name", payload.name);
  if (payload.org_id) headers.set("x-org-id", payload.org_id);
  if (payload.department_id) headers.set("x-dept-id", payload.department_id);

  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: [
    "/((?!_next|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)|api/auth).*)",
  ],
};
