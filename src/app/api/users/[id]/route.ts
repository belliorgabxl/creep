import { NextRequest, NextResponse } from "next/server";
import { GetUserByIdFromApiServer } from "@/api/users.server";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> } 
) {
  const { id } = await params; 

  const user = await GetUserByIdFromApiServer(id);

  if (!user) {
    return NextResponse.json(
      { success: false, message: "User not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: user,
  });
}
