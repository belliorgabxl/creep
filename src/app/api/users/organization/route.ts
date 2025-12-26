import { NextResponse } from "next/server";
import { GetUserByOrgFromApiServer } from "@/api/users.server";

/**
 * GET /api/users/organization?page=1&limit=10&status=active
 * ดึงรายชื่อผู้ใช้ในองค์กร พร้อม pagination และ filter
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 10);
    const status = searchParams.get("status") || undefined;

    // Validate inputs
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid pagination parameters",
        },
        { status: 400 }
      );
    }

    const result = await GetUserByOrgFromApiServer(
      page,
      limit,
      status as "active" | "inactive" | "all" | undefined
    );

    return NextResponse.json({
      success: true,
      data: result.items,
      total: result.total,
      page: result.page,
      limit: result.limit,
      total_pages: result.total_pages,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        total_pages: result.total_pages,
        has_prev: result.page > 1,
        has_next: result.page < result.total_pages,
      },
    });
  } catch (error: any) {
    console.error("[GET /api/users/organization] Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}
