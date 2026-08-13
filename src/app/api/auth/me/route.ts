import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { nestGet } from "@/lib/server-api";
import type { OrganizationResponse } from "@/dto/organizationDto";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { authenticated: false, message: "Unauthenticated" },
      { status: 401 }
    );
  }

  // Fetch organization name if org_id is available
  let organization_name: string | null = null;
  if (user.org_id) {
    const orgRes = await nestGet<OrganizationResponse>(`/organizations/${user.org_id}`);
    if (orgRes.success && orgRes.data?.name) {
      organization_name = orgRes.data.name;
    }
  }

  const fullName = user.name ?? user.username;

  return NextResponse.json({
    authenticated: true,
    id: user.sub,
    name: fullName,
    full_name: fullName,
    organization_id: user.org_id ?? null,
    organization_name,
    department_id: user.department_id ?? null,
    department_name: null,
    is_active: true,
    role: user.role ?? null,
    role_code: user.role ?? null,
    approval_level: user.approval_level ?? 0,
    username: user.username,
    email: null,
    position: null,
  });
}
