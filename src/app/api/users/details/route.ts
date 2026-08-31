import { NextResponse } from "next/server";
import { UpdateUserFromApiServer } from "@/api/users.server";

export async function PATCH(req: Request) {
  const payload = await req.json();
  const r = await UpdateUserFromApiServer(payload);

  if (!r.success) {
    return NextResponse.json(
      { success: false, message: r.message },
      { status: r.status ?? 400 }
    );
  }

  return NextResponse.json({ success: true });
}
