import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ success: true }, { status: 200 });

  res.cookies.set("auth_token", "", { httpOnly: true, maxAge: 0, path: "/" });
  res.cookies.set("api_token", "", { httpOnly: false, maxAge: 0, path: "/" });

  return res;
}
