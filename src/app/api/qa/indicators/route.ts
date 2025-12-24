import { NextResponse } from "next/server";
import { nestFetch } from "@/lib/server-api";
import type { QaRequest } from "@/dto/qaDto";

export async function POST(req: Request) {
  let payload: QaRequest | null = null;
  try {
    payload = (await req.json()) as QaRequest;
  } catch {
    return NextResponse.json({ success: false, message: "Invalid JSON body" }, { status: 400 });
  }

  const r = await nestFetch<any>("/qa-indicators", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!r.success) {
    return NextResponse.json({ success: false, message: r.message }, { status: 400 });
  }

  const ok = !(r.data?.responseCode && r.data.responseCode !== "00");
  return NextResponse.json({ success: true, data: ok });
}
