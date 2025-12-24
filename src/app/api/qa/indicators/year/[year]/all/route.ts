import { NextResponse } from "next/server";
import { nestGet } from "@/lib/server-api";
import type { GetQaIndicatorsByYearRespond } from "@/dto/qaDto";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ year: string }> }
) {
  const { year } = await params;

  const r = await nestGet<any>(`/qa-indicators/organization/year/${encodeURIComponent(year)}/all`);
  if (!r.success) {
    return NextResponse.json({ success: false, message: r.message }, { status: 400 });
  }

  const body = r.data;
  let list: GetQaIndicatorsByYearRespond[] = [];

  if (Array.isArray(body)) list = body;
  else if (Array.isArray((body as any)?.data)) list = (body as any).data;
  else if ((body as any)?.data && typeof (body as any).data === "object") list = [(body as any).data];

  return NextResponse.json({ success: true, data: list });
}
