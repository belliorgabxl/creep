import { NextRequest, NextResponse } from "next/server";
import { nestFetch, nestGet, nestPost } from "@/lib/server-api";
import type {
  CreateProjectPayload,
  CreateProjectResponse,
} from "@/dto/createProjectDto";
import { GeneralInfoForUpdateData } from "@/dto/projectDto";
import type { GetProjectsByOrgRespond } from "@/dto/dashboardDto";

/* ────────────────────────────────────────────────────────────
   GET /api/projects?limit=500&page=1&...
   Proxies to backend GET /projects with automatic pagination.
   Backend hard-caps limit at 100, so we loop through pages
   to collect up to 1000 projects (10 pages × 100).
──────────────────────────────────────────────────────────── */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const requestedLimit = Math.min(Number(searchParams.get("limit") ?? "20"), 1000);
    const PAGE_SIZE = 100; // backend max

    // Build common filter params (pass-through)
    const filterKeys = ["name", "code", "plan_type", "is_active", "department_id", "start_date", "status"];
    const filters = new URLSearchParams();
    for (const k of filterKeys) {
      const v = searchParams.get(k);
      if (v) filters.set(k, v);
    }

    const allProjects: GetProjectsByOrgRespond[] = [];
    let page = 1;
    let totalFetched = 0;

    while (totalFetched < requestedLimit) {
      const thisBatch = Math.min(PAGE_SIZE, requestedLimit - totalFetched);
      const qs = new URLSearchParams(filters);
      qs.set("page", String(page));
      qs.set("limit", String(thisBatch));

      const r = await nestGet<unknown>(`/projects?${qs.toString()}`);
      if (!r.success) break;

      const raw = r.data as any;
      const items: GetProjectsByOrgRespond[] = Array.isArray(raw)
        ? raw
        : Array.isArray(raw?.data)
        ? raw.data
        : Array.isArray(raw?.items)
        ? raw.items
        : [];

      allProjects.push(...items);
      totalFetched += items.length;

      // Stop if this page returned fewer than requested (last page)
      if (items.length < thisBatch) break;
      page++;
    }

    return NextResponse.json({ success: true, data: allProjects, total: allProjects.length });
  } catch (error: any) {
    console.error("[API] GET /api/projects error:", error);
    return NextResponse.json(
      { success: false, message: error?.message ?? "Internal server error" },
      { status: 500 }
    );
  }
}

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



export async function PATCH(req: Request) {
  let payload: GeneralInfoForUpdateData | null = null;

  try {
    payload = (await req.json()) as GeneralInfoForUpdateData;
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid JSON body" },
      { status: 400 }
    );
  }

  if (!payload?.project_id) {
    return NextResponse.json(
      { success: false, message: "project_id is required" },
      { status: 400 }
    );
  }

  const r = await nestFetch<{ message: string }>("/projects", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!r.success) {
    return NextResponse.json(
      { success: false, message: r.message ?? "Update project failed" },
      { status: r.status ?? 400 }
    );
  }

  return NextResponse.json({ success: true, data: r.data });
}