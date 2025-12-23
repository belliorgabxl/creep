import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { roleIdToLabel } from "@/lib/rbac";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { authenticated: false, message: "Unauthenticated" },
      { status: 401 }
    );
  }

  const role_label = roleIdToLabel(user.role_id) ?? null;

  return NextResponse.json({
    authenticated: true,
    user: {
      id: user.sub,
      username: user.username,
      name: user.name ?? user.username,
      role_key: user.role ?? null,   
      role_id: user.role_id ?? null,              
      role_label,                              
      org_id: user.org_id ?? null,
      department_id: user.department_id ?? null,
    },
  });
}
