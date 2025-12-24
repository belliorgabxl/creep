import { NextResponse } from "next/server";
import { nestGet } from "@/lib/server-api";
import type { GetQaIndicatorsCountsByYear } from "@/dto/qaDto";

export async function GET() {
  const r = await nestGet<any>("/qa-indicators/organization/counts-by-year");
  if (!r.success) {
    return NextResponse.json({ success: false, message: r.message }, { status: 400 });
  }

  const body = r.data;
  let list: GetQaIndicatorsCountsByYear[] = [];

  if (Array.isArray(body)) list = body;
  else if (Array.isArray((body as any)?.data)) list = (body as any).data;
  else if ((body as any)?.data && typeof (body as any).data === "object") list = [(body as any).data];

  return NextResponse.json({ success: true, data: list });
}
