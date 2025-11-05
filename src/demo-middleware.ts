import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const PUBLIC_PATHS = ["/", "/login", "/forgot-password"];

function pickHomeByRole(role?: string) {
  if (role === "admin") return "/admin";
  return "/user/dashboard";
}

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token as { role?: string } | null;

    const cookieRole = req.cookies.get("mock_role")?.value || undefined;
    const hasMockUid = !!req.cookies.get("mock_uid")?.value;

    const role = token?.role || cookieRole;
    const isAuthed = !!token || hasMockUid;

    const { pathname, search } = req.nextUrl;
    if (isAuthed && (pathname === "/login" || pathname === "/forgot-password" || pathname === "/")) {
      const url = new URL(pickHomeByRole(role), req.url);
      return NextResponse.redirect(url);
    }

    if (pathname.startsWith("/admin") && role !== "admin") {
      const url = new URL("/login", req.url);
      url.searchParams.set("redirect", pathname + (search || ""));
      return NextResponse.redirect(url);
    }
    if (pathname.startsWith("/user") && role !== "user") {
      const url = new URL("/login", req.url);
      url.searchParams.set("redirect", pathname + (search || ""));
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  },
  {
    pages: { signIn: "/login" },
    callbacks: {
      authorized: ({ req, token }) => {
        const path = req.nextUrl.pathname;

        if (PUBLIC_PATHS.includes(path)) return true;
        if (token) return true;
        const hasMockUid = !!req.cookies.get("mock_uid")?.value;
        return hasMockUid;
      },
    },
  }
);
export const config = {
  matcher: [
    "/((?!_next|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)|api/auth).*)",
  ],
};
