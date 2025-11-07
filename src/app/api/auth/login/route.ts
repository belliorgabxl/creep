import { NextResponse } from "next/server";
import { decodeExternalJwt, signUserToken } from "@/lib/auth";
import { ROLE_MAP, roleIdToKey } from "@/lib/rbac";

type LoginBody = { username: string; password: string; remember?: boolean };

async function safeMessage(res: Response) {
  try { const j: any = await res.json(); return j?.message || j?.error || ""; }
  catch { return ""; }
}

async function loginExternal(username: string, password: string) {
  const url = (process.env.API_BASE_URL || "") + "/auth/login";
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const msg = await safeMessage(res);
    throw new Error(msg || `External login failed (${res.status})`);
  }
  const data: any = await res.json();
  const token: string | undefined =
    data?.token || data?.access_token || data?.jwt || data?.data?.token;
  if (!token) throw new Error("No token returned from external API");
  return { token, raw: data };
}

export async function POST(req: Request) {
  try {
    const { username, password, remember }: LoginBody = await req.json();

    const { token: externalToken } = await loginExternal(username, password);

    // claims จาก external (อาจเป็นเลข)
    const claims = decodeExternalJwt<any>(externalToken) || {};

    // ----------------------------
    // ⭐ ตรวจ role และ map ให้ถูกต้อง
    // ----------------------------
    // รองรับหลายชื่อ field ที่อาจมาจากระบบหลังบ้าน
    const rawRoleId =
      claims.role_id ?? claims.role ?? claims.user_role ?? claims.roleId ?? claims.user_role_id;

    const role_key = roleIdToKey(rawRoleId);
    if (!role_key) {
      // ถ้าเลข role ไม่ตรง mapping → ไม่อนุญาต
      return NextResponse.json(
        { success: false, message: "สิทธิ์การใช้งานไม่ถูกต้อง (Unknown role)" },
        { status: 403 }
      );
    }

    const role_id = Number(rawRoleId);

    const userForOurJwt = {
      sub: (claims.sub as string) || claims.user_id || claims.id || username,
      username: (claims.username as string) || username,
      role: role_key,        // ใช้ key เพื่อ middleware
      role_id,               // เก็บเลขไว้เผื่อใช้งานแสดงผล/อ้างอิง
      name: (claims.name as string) || claims.fullname || username,
      org_id: claims.org_id || claims.organization_id,
      department_id: claims.department_id || claims.dept_id,
    };

    const ttl = remember ? 7 * 24 * 60 * 60 : 60 * 60; // 7 วัน / 1 ชม.
    const ourJwt = await signUserToken(userForOurJwt, ttl);

    const res = NextResponse.json(
      { success: true },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );

    // external token
    res.cookies.set("api_token", externalToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: ttl,
    });

    // auth_token ของเรา (มี role_key + role_id)
    res.cookies.set("auth_token", ourJwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: ttl,
    });

    return res;
  } catch (e: any) {
    return NextResponse.json(
      { success: false, message: e?.message || "เกิดข้อผิดพลาด" },
      { status: 401 }
    );
  }
}
