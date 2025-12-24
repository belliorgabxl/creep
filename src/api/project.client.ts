import type { GetCalenderEventRespond } from "@/dto/dashboardDto";
import type { CreateProjectPayload, CreateProjectResponse } from "@/dto/createProjectDto";
import { clientFetch } from "@/lib/client-api";

export async function getCalendarEvents(): Promise<GetCalenderEventRespond[]> {
  const r = await clientFetch<GetCalenderEventRespond[]>("/api/projects/calendar-events", {
    cache: "no-store",
  });
  return r.success ? (r.data ?? []) : [];
}

export async function createProject(payload: CreateProjectPayload): Promise<CreateProjectResponse> {
  const r = await clientFetch<CreateProjectResponse>("/api/projects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!r.success) throw new Error(r.message ?? "Create project failed");
  return r.data;
}
