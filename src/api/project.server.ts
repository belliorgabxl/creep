import type { ProjectInformationResponse } from "@/dto/projectDto";
import { nestGet } from "@/lib/server-api";

export async function fetchProjectInformationServer(projectId: string) {
  const r = await nestGet<ProjectInformationResponse>(
    `/projects/information?project_id=${encodeURIComponent(projectId)}`
  );

  if (!r.success) throw new Error(r.message ?? "Failed to fetch project information");
  return r.data;
}
