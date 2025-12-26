import { NextResponse } from "next/server";
import { CreateUserFromApiServer } from "@/api/users.server";
import type { CreateUserRequest } from "@/dto/userDto";

/**
 * POST /api/users
 * สร้างผู้ใช้ใหม่
 */
export async function POST(req: Request) {
  try {
    const payload: CreateUserRequest = await req.json();

    // Basic validation
    if (!payload.email || !payload.username || !payload.password) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields: email, username, password",
        },
        { status: 400 }
      );
    }

    const result = await CreateUserFromApiServer(payload);

    if (!result.ok) {
      return NextResponse.json(
        {
          success: false,
          message: result.message || "Failed to create user",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: result.data,
        message: "User created successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[POST /api/users] Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}
