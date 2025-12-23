// src/app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const redirectUrl = new URL("/login", req.url);
  const res = NextResponse.redirect(redirectUrl, 303);

  res.cookies.set("auth_token", "", { maxAge: 0, path: "/" });
  res.cookies.set("api_token", "", { maxAge: 0, path: "/" });
  res.cookies.set("refresh_token", "", { maxAge: 0, path: "/" });

  return res;
}