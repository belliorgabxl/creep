import { NextResponse } from "next/server";
import { nestGet } from "@/lib/server-api";
import type { GetApprovalItems } from "@/dto/dashboardDto";

export async function GET() {
  const r = await nestGet<{ data?: GetApprovalItems | GetApprovalItems[] }>(
    "/budget-plans/approval-items"
  );

  if (!r.success) {
    return NextResponse.json({ success: false, message: r.message }, { status: 400 });
  }

  const payload = r.data?.data;
  const list = Array.isArray(payload) ? payload : payload ? [payload] : [];

  return NextResponse.json({ success: true, data: list });
}
