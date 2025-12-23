import { NextResponse } from "next/server";
import { nestGet } from "@/lib/server-api";
import type { Department } from "@/dto/departmentDto";

export async function GET() {
  const r = await nestGet<Department[]>("/departments");

  if (!r.success) {
    return NextResponse.json(
      { success: false, message: r.message ?? "Failed to fetch departments" },
      { status: 400 }
    );
  }

  return NextResponse.json({
    success: true,
    data: r.data ?? [],
  });
}
