import { NextResponse } from "next/server";
import { decodeExternalJwt, signUserToken } from "@/lib/auth";

type LoginBody = { username: string; password: string; remember?: boolean };

// เดาว่า endpoint รับ { username, password } ตามสกรีนช็อต
async function loginExternal(username: string, password: string) {
  const url = (process.env.API_BASE_URL || "") + ("/auth/login");
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ username, password }),
  });

  // รองรับได้หลายรูปแบบ response
  if (!res.ok) {
    const msg = await safeMessage(res);
    throw new Error(msg || `External login failed (${res.status})`);
  }
  const data: any = await res.json();
  // อาจชื่อ token / access_token / jwt
  const token: string | undefined = data?.token || data?.access_token || data?.jwt || data?.data?.token;
  if (!token) throw new Error("No token returned from external API");
  return { token, raw: data };
}

async function safeMessage(res: Response) {
  try {
    const j: any = await res.json();
    return j?.message || j?.error || "";
  } catch { return ""; }
}

export async function POST(req: Request) {
  try {
    const { username, password, remember }: LoginBody = await req.json();

    const { token: externalToken } = await loginExternal(username, password);

    // พยายามดึง claims จาก external JWT (ถ้ามี)
    const claims = decodeExternalJwt<any>(externalToken) || {};
    const userForOurJwt = {
      sub: (claims.sub as string) || claims.user_id || claims.id || username,
      username: (claims.username as string) || username,
      role: (claims.role as string) || claims.user_role || "department_user",
      name: (claims.name as string) || claims.fullname || username,
      org_id: claims.org_id || claims.organization_id,
      department_id: claims.department_id || claims.dept_id,
    };

    const ttl = remember ? 7 * 24 * 60 * 60 : 60 * 60; // 7 วัน / 1 ชม.
    const ourJwt = await signUserToken(userForOurJwt, ttl);

    const res = NextResponse.json({ success: true });

    // เก็บ external token ไว้เรียก API ต่อ ๆ ไป
    res.cookies.set("api_token", externalToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: ttl,
    });

    // เก็บ auth_token (ของเรา) สำหรับ middleware/RBAC
    res.cookies.set("auth_token", ourJwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: ttl,
    });

    return res;
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e?.message || "เกิดข้อผิดพลาด" }, { status: 401 });
  }
}
