import { NextResponse } from "next/server";
import { nestGet } from "@/lib/server-api";
import type { ProjectInformationResponse } from "@/dto/projectDto";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const projectId = url.searchParams.get("project_id");

  if (!projectId) {
    return NextResponse.json(
      { success: false, message: "project_id is required" },
      { status: 400 }
    );
  }

  const r = await nestGet<ProjectInformationResponse>(
    `/projects/information?project_id=${encodeURIComponent(projectId)}`
  );

  if (!r.success) {
    return NextResponse.json(
      {
        success: false,
        message: r.message ?? "Failed to fetch project information",
      },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true, data: r.data });
}
