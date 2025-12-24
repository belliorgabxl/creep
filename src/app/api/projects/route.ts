import { NextResponse } from "next/server";
import { nestPost } from "@/lib/server-api";
import type {
  CreateProjectPayload,
  CreateProjectResponse,
} from "@/dto/createProjectDto";

export async function POST(req: Request) {
  let payload: CreateProjectPayload | null = null;

  try {
    payload = (await req.json()) as CreateProjectPayload;
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const r = await nestPost<CreateProjectResponse>("/projects/", payload);

  if (!r.success) {
    return NextResponse.json(
      { success: false, message: r.message ?? "Create project failed" },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true, data: r.data });
}
