import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ success: true });
  res.cookies.delete("auth_token");
  res.cookies.delete("api_token");
  return res;
}
