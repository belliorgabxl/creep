import { NextResponse } from "next/server";
import { nestFetch, nestGet } from "@/lib/server-api";
import type { GetQaIndicatorsRespond, QaRequest } from "@/dto/qaDto";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const r = await nestGet<any>(`/qa-indicators/${encodeURIComponent(id)}`);
  if (!r.success) {
    return NextResponse.json({ success: false, message: r.message }, { status: 400 });
  }

  const body = r.data;
  let list: GetQaIndicatorsRespond[] = [];

  if (Array.isArray(body)) list = body;
  else if ((body as any)?.data) {
    const payload = (body as any).data;
    list = Array.isArray(payload) ? payload : payload ? [payload] : [];
  } else if (body && typeof body === "object") {
    list = [body as GetQaIndicatorsRespond];
  }

  return NextResponse.json({ success: true, data: list });
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  let payload: Partial<QaRequest> | null = null;
  try {
    payload = (await req.json()) as Partial<QaRequest>;
  } catch {
    return NextResponse.json({ success: false, message: "Invalid JSON body" }, { status: 400 });
  }

  const r = await nestFetch<any>(`/qa-indicators/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!r.success) {
    return NextResponse.json({ success: false, message: r.message }, { status: 400 });
  }

  const ok = !(r.data?.responseCode && r.data.responseCode !== "00");
  return NextResponse.json({ success: true, data: ok });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const r = await nestFetch<any>(`/qa-indicators/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });

  if (!r.success) {
    return NextResponse.json({ success: false, message: r.message }, { status: 400 });
  }

  const ok = !(r.data?.responseCode && r.data.responseCode !== "00");
  return NextResponse.json({ success: true, data: ok });
}
