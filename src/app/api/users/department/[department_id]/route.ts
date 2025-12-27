import { NextResponse } from "next/server";
import { nestGet } from "@/lib/server-api";
import { cookies } from "next/headers";
import type { GetUserRespond } from "@/dto/userDto";

/**
 * GET /api/users/department/{department_id}
 * ดึงรายชื่อผู้ใช้ในแผนก/หน่วยงานที่ระบุ
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ department_id: string }> }
) {
  try {
    const { department_id } = await params;
    const token = (await cookies()).get("api_token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Missing api_token cookie" },
        { status: 401 }
      );
    }

    if (!department_id) {
      return NextResponse.json(
        { success: false, message: "Department ID is required" },
        { status: 400 }
      );
    }

    // Call backend API: /users/organization/{department_id}
    const r = await nestGet<GetUserRespond[]>(
      `/users/organization/${encodeURIComponent(department_id)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!r.success) {
      return NextResponse.json(
        { success: false, message: r.message || "Failed to fetch users" },
        { status: 400 }
      );
    }

    // Backend may return array directly or wrapped in { data: [...] }
    const users = Array.isArray(r.data) ? r.data : (r.data as any)?.data ?? [];

    return NextResponse.json({
      success: true,
      data: users,
      total: users.length,
    });
  } catch (error: any) {
    console.error("[GET /api/users/department/{department_id}] Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}
