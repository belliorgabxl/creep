// src/app/api/department/route.ts
import { NextResponse } from "next/server";
import { nestGet } from "@/lib/server-api";
import type { Department } from "@/dto/departmentDto";
import { cookies } from "next/headers";

export async function GET() {
  const token = (await cookies()).get("api_token")?.value;

  if (!token) {
    return NextResponse.json(
      { success: false, message: "Missing api_token cookie" },
      { status: 401 }
    );
  }

  const r = await nestGet<Department[]>("/api/department", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!r.success) {
    return NextResponse.json(
      { success: false, message: r.message },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true, data: r.data ?? [] });
}