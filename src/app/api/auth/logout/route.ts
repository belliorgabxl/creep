import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ success: true });
  for (const name of ["auth_token", "api_token"]) {
    res.cookies.set(name, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
  }
  return res;
}
