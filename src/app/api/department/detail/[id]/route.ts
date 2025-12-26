// src/app/api/department/detail/[id]/route.ts
import { NextResponse } from "next/server";
import { nestGet } from "@/lib/server-api";
import type { Department } from "@/dto/departmentDto";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const r = await nestGet<{ data?: Department | Department[] }>(
    `/departments/detail/${id}`
  );

  if (!r.success) {
    return NextResponse.json(
      { success: false, message: r.message },
      { status: 400 }
    );
  }

  const payload = r.data?.data;
  const list = Array.isArray(payload)
    ? payload
    : payload
    ? [payload]
    : [];

  return NextResponse.json({
    success: true,
    data: list,
  });
}
