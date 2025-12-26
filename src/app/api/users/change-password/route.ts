import { NextResponse } from "next/server";
import { nestFetch } from "@/lib/server-api";

type Body = {
  current_password: string;
  new_password: string;
};

export async function PUT(req: Request) {
  let body: Body | null = null;

  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid JSON body" },
      { status: 400 }
    );
  }

  if (!body?.current_password || !body?.new_password) {
    return NextResponse.json(
      { success: false, message: "current_password and new_password are required" },
      { status: 400 }
    );
  }

  const incomingAuth = req.headers.get("authorization") ?? undefined;

  const r = await nestFetch<{ message: string }>("/users/me/password", {
    method: "PUT",
    headers: incomingAuth ? { Authorization: incomingAuth, "Content-Type": "application/json", Accept: "application/json" } : { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
  });

  if (!r.success) {
    return NextResponse.json(
      { success: false, message: r.message ?? "Change password failed" },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true, data: r.data });
}
