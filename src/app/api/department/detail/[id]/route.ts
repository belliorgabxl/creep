import { NextResponse } from "next/server";
import { nestGet } from "@/lib/server-api";
import type { Department } from "@/dto/departmentDto";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    console.log("[API] GET /api/department/detail/" + id);

    const r = await nestGet<Department | { data?: Department }>(
      `/departments/detail/${id}`
    );

    console.log("[API] Backend response:", {
      success: r.success,
      hasData: r.success ? !!r.data : false,
      dataKeys: (r.success && r.data) ? Object.keys(r.data) : [],
    });

    if (!r.success) {
      console.error("[API] Backend failed:", r.message);
      return NextResponse.json(
        { success: false, message: r.message },
        { status: 400 }
      );
    }

    // unwrap กรณี backend ห่อ data
    const payload =
      r.data && typeof r.data === "object" && "data" in r.data
        ? r.data.data
        : r.data;

    console.log("[API] Sending payload:", payload ? "object with keys: " + Object.keys(payload).join(", ") : "null");

    return NextResponse.json({
      success: true,
      data: payload ?? null,
    });
  } catch (error: any) {
    console.error("[API] Exception in GET /api/department/detail:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}