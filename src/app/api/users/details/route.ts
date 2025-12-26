import { NextResponse } from "next/server";
import { UpdateUserFromApiServer } from "@/api/users.server";

export async function PATCH(req: Request) {
  const payload = await req.json();
  const ok = await UpdateUserFromApiServer(payload);

  if (!ok) {
    return NextResponse.json(
      { success: false },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true });
}
