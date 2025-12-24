import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ success: true }, { status: 200 });

  res.cookies.set("auth_token", "", { maxAge: 0, path: "/" });
  res.cookies.set("api_token", "", { maxAge: 0, path: "/" });
  res.cookies.set("refresh_token", "", { maxAge: 0, path: "/" });

  return res;
}
