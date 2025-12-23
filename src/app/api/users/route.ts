import { NextResponse } from "next/server";
import { nestGet } from "@/lib/server-api";
import type { User } from "@/dto/userDto";

export async function GET() {
  const r = await nestGet<User[]>("/users/");

  if (!r.success) {
    return NextResponse.json(
      { success: false, message: r.message ?? "Failed to fetch users" },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true, data: r.data ?? [] });
}
