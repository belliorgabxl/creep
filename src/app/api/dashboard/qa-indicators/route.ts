import { NextResponse } from "next/server";
import { nestGet } from "@/lib/server-api";
import type { GetQaIndicatorsRespond } from "@/dto/qaDto";

export async function GET() {
  const r = await nestGet<{ data?: GetQaIndicatorsRespond | GetQaIndicatorsRespond[] }>(
    "/qa-indicators/organization"
  );

  if (!r.success) {
    return NextResponse.json({ success: false, message: r.message }, { status: 400 });
  }

  const payload = r.data?.data;
  const list = Array.isArray(payload) ? payload : payload ? [payload] : [];

  return NextResponse.json({ success: true, data: list });
}
