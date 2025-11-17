import { NextResponse } from "next/server";
import { decodeExternalJwt, signUserToken } from "@/lib/auth";
import { pickHomeByRole, roleIdToKey } from "@/lib/rbac";
import ApiClient from "@/lib/api-clients";

type LoginBody = { username: string; password: string; remember?: boolean };

function pickSafeMessage(data: any) {
  return data?.message || data?.error || "";
}

async function loginExternal(username: string, password: string) {
  const baseURL = process.env.API_BASE_URL || "";
  if (!baseURL) {
    throw new Error("Missing API_BASE_URL");
  }

  try {
    const res = await ApiClient.post(
      "/auth/login",
      { username, password },
      {
        baseURL,
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        timeout: 10_000,
        withCredentials: false,
      }
    );
    const data: any = res?.data ?? {};

    const token: string | undefined =
      data?.token || data?.access_token || data?.jwt || data?.data?.token;
    if (!token) throw new Error("No token returned from external API");

    return { token, raw: data };
  } catch (err: any) {
    const safe = pickSafeMessage(err?.response?.data) || "External login failed";
    const status = err?.response?.status;
    if (status === 401 || status === 403) {
      const e = new Error("Invalid username or password");
      (e as any).status = 401;
      throw e;
    }
    const e = new Error(safe);
    (e as any).status = status || 502;
    throw e;
  }
}

export async function POST(req: Request) {
  try {
    const { username, password, remember }: LoginBody = await req.json();

    const { token: externalToken } = await loginExternal(username, password);

    const claims = decodeExternalJwt<any>(externalToken) || {};

    const nowSec = Math.floor(Date.now() / 1000);
    if (typeof claims.exp === "number" && claims.exp + 300 < nowSec) {
      return NextResponse.json(
        { success: false, message: "External token expired" },
        { status: 401 }
      );
    }
    if (typeof claims.nbf === "number" && claims.nbf - 300 > nowSec) {
      return NextResponse.json(
        { success: false, message: "External token not yet valid" },
        { status: 401 }
      );
    }

    const rawRoleId =
      claims.role_id ??
      claims.role ??
      claims.user_role ??
      claims.roleId ??
      claims.user_role_id;

    const role_key = roleIdToKey(rawRoleId);
    if (!role_key) {
      return NextResponse.json(
        { success: false, message: "สิทธิ์การใช้งานไม่ถูกต้อง (Unknown role)" },
        { status: 403 }
      );
    }
    const role_id = Number(rawRoleId);

    const userForOurJwt = {
      sub: (claims.sub as string) || claims.user_id || claims.id || username,
      username: (claims.username as string) || username,
      role: role_key,
      role_id,
      name: (claims.name as string) || claims.fullname || username,
      org_id: claims.org_id || claims.organization_id || undefined,
      department_id: claims.department_id || claims.dept_id || undefined,
    };

    const ttl = remember ? 7 * 24 * 60 * 60 : 60 * 60;

    const ourJwt = await signUserToken(userForOurJwt, ttl);

    const res = NextResponse.json(
      { success: true, home: pickHomeByRole(role_key) },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );

    const isProd = process.env.NODE_ENV === "production";

    res.cookies.set("auth_token", ourJwt, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      path: "/",
      maxAge: ttl,
      priority: "high",
    });

    res.cookies.set("api_token", externalToken, {
      httpOnly: false,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      path: "/",
      maxAge: ttl,
      priority: "high",
    });

    return res;
  } catch (e: any) {
    const status = e?.status ?? 401;
    const message =
      status === 401 ? "Invalid username or password" : e?.message || "เกิดข้อผิดพลาด";
    return NextResponse.json({ success: false, message }, { status });
  }
}
