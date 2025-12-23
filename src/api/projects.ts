import type { GetCalenderEventRespond } from "@/dto/dashboardDto";
import type { CreateProjectPayload, CreateProjectResponse } from "@/dto/createProjectDto";
import type { ProjectInformationResponse } from "@/dto/projectDto";
import { clientFetch } from "@/lib/client-api";

export async function getCalendarEvents(): Promise<GetCalenderEventRespond[]> {
  const r = await clientFetch<GetCalenderEventRespond[]>("/api/projects/calendar-events", {
    cache: "no-store",
  });
  return r.success ? (r.data ?? []) : [];
}

export async function createProject(
  payload: CreateProjectPayload
): Promise<CreateProjectResponse> {
  const r = await clientFetch<CreateProjectResponse>("/api/projects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!r.success) {
    throw new Error(r.message ?? "Create project failed");
  }
  return r.data;
}

export async function fetchProjectInformation(
  projectId: string
): Promise<ProjectInformationResponse> {
  const r = await clientFetch<ProjectInformationResponse>(
    `/api/projects/information?project_id=${encodeURIComponent(projectId)}`,
    { cache: "no-store" }
  );

  if (!r.success) {
    throw new Error(r.message ?? "Failed to fetch project information");
  }
  return r.data;
}
