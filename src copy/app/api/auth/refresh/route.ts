import { NextRequest, NextResponse } from "next/server";
import ApiClient from "@/lib/api-clients";

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const isProd = process.env.NODE_ENV === "production";

  const refreshToken = req.cookies.get("refresh_token")?.value;
  if (!refreshToken) {
    const redirectUrl = new URL("/login", req.url);
    return NextResponse.redirect(redirectUrl);
  }

  try {
    const baseURL = process.env.API_BASE_URL || "";
    const res = await ApiClient.post(
      "/auth/refresh",
      { refresh_token: refreshToken },
      { baseURL, timeout: 10000 }
    );

    const data: any = res?.data ?? {};

    const newExternalToken = data?.token || data?.access_token || data?.jwt;
    const newRefreshToken = data?.refresh_token || refreshToken; // ถ้า backend หมุน refresh token คืนมา

    const response = NextResponse.json({ success: true });
    response.cookies.set("api_token", newExternalToken, {
      httpOnly: false,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      path: "/",
      // อาจจะ set same maxAge as access token
      maxAge: 60 * 60, // 1 hour, ปรับตามจริง
    });

    // ถ้า backend ส่ง refresh_token ใหม่ ให้อัปเดต cookie ด้วย
    if (newRefreshToken) {
      response.cookies.set("refresh_token", newRefreshToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        path: "/",
        maxAge: 30 * 24 * 3600,
      });
    }


    return response;
  } catch (err: any) {
    const redirectUrl = new URL("/login", req.url);
    const resFail = NextResponse.redirect(redirectUrl);
    resFail.cookies.set("auth_token", "", { maxAge: 0, path: "/" });
    resFail.cookies.set("api_token", "", { maxAge: 0, path: "/" });
    resFail.cookies.set("refresh_token", "", { maxAge: 0, path: "/" });
    return resFail;
  }
}
