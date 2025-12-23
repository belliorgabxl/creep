import { NextResponse } from "next/server";
import { nestGet } from "@/lib/server-api";
import type { GetCalenderEventRespond } from "@/dto/dashboardDto";

export async function GET() {
  const r = await nestGet<any>("/projects/calendar-events");
  if (!r.success) {
    return NextResponse.json(
      { success: false, message: r.message ?? "Failed" },
      { status: 400 }
    );
  }
  const body = r.data;
  const payload: any[] = Array.isArray(body)
    ? body
    : Array.isArray((body as any)?.data)
    ? (body as any).data
    : [];

  const mapped: GetCalenderEventRespond[] = payload.map((e: any) => ({
    id: String(e.id ?? e._id ?? crypto.randomUUID()),
    title: e.title ?? e.name ?? "Untitled",
    start_date: e.start_date ?? e.start ?? e.begin_date ?? "",
    end_date: e.end_date ?? e.end ?? e.finish_date ?? undefined,
    department: e.department ?? e.dept ?? undefined,
    status: e.status ?? undefined,
    plan_id: e.plan_id ?? undefined,
  }));

  return NextResponse.json({ success: true, data: mapped });
}
