// middleware.ts
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

/**
 * หน้าแรกหลังล็อกอิน ให้เข้าหน้าใหม่ตามโครง /organizer/...
 * - director -> /organizer/dashboard/director
 * - hr       -> /organizer/dashboard/hr
 * - department_user     -> /organizer/dashboard/user
 * - planning/department_head/อื่นๆ -> ส่งเข้าหน้ากลางที่ส่วนใหญ่เข้าได้ (projects)
 */

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get("auth_token")?.value ?? null;

  // 1) เส้นทาง public
  if (isPublicPath(pathname)) {
    if (token) {
      try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        const homeUrl = new URL(pickHomeByRole(payload.role as string), request.url);
        return NextResponse.redirect(homeUrl);
      } catch {
        // โทเคนเสีย/หมดอายุ -> ปล่อยเข้าหน้า public ต่อไป
      }
    }
    return NextResponse.next();
  }

  // 2) ยังไม่ล็อกอิน -> ส่งไป login พร้อม redirect กลับ
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname + (search || ""));
    return NextResponse.redirect(loginUrl);
  }

  // 3) ตรวจโทเคน
  let payload: any;
  try {
    ({ payload } = await jwtVerify(token, JWT_SECRET));
  } catch {
    const res = NextResponse.redirect(new URL("/login", request.url));
    res.cookies.delete("auth_token");
    res.cookies.delete("api_token");
    return res;
  }

  const role = (payload.role as string) || "department_user"; // ดีฟอลต์ไปที่ user ธรรมดา

  // 4) กติกา “ตามเส้นทาง” ที่ต้องการ
  const forbid = () => NextResponse.redirect(new URL("/403", request.url));

  // 4.1 Dashboard เฉพาะตาม role
  if (pathStarts(pathname, "/organizer/dashboard/user") && role !== "department_user") {
    return forbid();
  }
  if (pathStarts(pathname, "/organizer/dashboard/hr") && role !== "hr") {
    return forbid();
  }
  if (pathStarts(pathname, "/organizer/dashboard/director") && role !== "director") {
    return forbid();
  }

  // 4.2 qa-coverage: ห้าม user, hr, admin
  if (pathStarts(pathname, "/organizer/qa-coverage")) {
    if (["department_user", "hr", "admin"].includes(role)) return forbid();
  }

  // 4.3 projects: ห้าม hr, admin
  if (pathStarts(pathname, "/organizer/projects")) {
    if (["hr", "admin"].includes(role)) return forbid();
  }

  // 4.4 department: ให้ hr เท่านั้น
  if (pathStarts(pathname, "/organizer/department")) {
    if (role !== "hr") return forbid();
  }

  // 4.5 admin: เผื่อมีหน้า /admin — ให้เฉพาะ admin
  if (pathStarts(pathname, "/admin") && role !== "admin") {
    return forbid();
  }

  // 5) แนบ header จาก payload
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
