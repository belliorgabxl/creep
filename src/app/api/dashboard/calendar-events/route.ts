import { NextResponse } from "next/server";
import { nestGet } from "@/lib/server-api";
import type { GetCalenderEventRespond } from "@/dto/dashboardDto";

export async function GET() {
  const r = await nestGet<any>("/projects/calendar-events");
  if (!r.success) {
    return NextResponse.json({ success: false, message: r.message }, { status: 400 });
  }


  const body = r.data;
  let list: GetCalenderEventRespond[] = [];

  if (Array.isArray(body)) list = body;
  else if (body && typeof body === "object" && (body as any).data !== undefined) {
    const payload = (body as any).data;
    list = Array.isArray(payload) ? payload : payload ? [payload] : [];
  } else if (body && typeof body === "object") {
    list = [body as GetCalenderEventRespond];
  }

  return NextResponse.json({ success: true, data: list });
}
