import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const PUBLIC_PREFIXES = ["/", "/login", "/forgot-password"];

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET
);

function isPublicPath(pathname: string) {
  return PUBLIC_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

function pickHomeByRole(role?: string): string {
  switch (role) {
    case "admin": return "/admin";
    case "planning": return "/planning";
    case "director": return "/director";
    case "hr": return "/hr";
    case "department_head": return "/department/head";
    default: return "/user/dashboard";
  }
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
      } catch {}
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
  } catch {
    const res = NextResponse.redirect(new URL("/login", request.url));
    res.cookies.delete("auth_token");
    res.cookies.delete("api_token");
    return res;
  }

  const role = (payload.role as string) || "department_user";
  const roleToPrefixes: Record<string, string[]> = {
    admin: ["/admin", "/planning", "/director", "/hr", "/department", "/user"],
    planning: ["/planning", "/user"],
    director: ["/director", "/user"],
    hr: ["/hr", "/user"],
    department_head: ["/department/head", "/user"],
    department_user: ["/user"],
  };
  const allowed = (roleToPrefixes[role] || ["/user"])
    .some((p) => pathname === p || pathname.startsWith(p + "/"));
  if (!allowed) return NextResponse.redirect(new URL("/403", request.url));

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
