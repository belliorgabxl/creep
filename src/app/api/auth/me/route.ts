import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET 
);

export async function GET() {
  const jar = await cookies();
  const token = jar.get("auth_token")?.value;
  if (!token) return NextResponse.json({ authenticated: false }, { status: 401 });

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const user = {
      id: (payload.sub as string) || "",
      username: (payload.username as string) || "",
      name: (payload.name as string) || "",
      role: (payload.role as string) || "",
      org_id: (payload.org_id as string) || undefined,
      department_id: (payload.department_id as string) || undefined,
    };
    return NextResponse.json({ authenticated: true, user });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
