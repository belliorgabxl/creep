import { nestFetch } from "@/lib/server-api";
import type { Department } from "@/dto/departmentDto";

export type UpdateDepartmentRequest = {
  code?: string;
  name?: string;
  is_active?: boolean;
};

export type DepartmentListResponse = {
  data: Department[];
};

/**
 * GET /departments/{org_id}
 * Get departments by organization ID
 */
export async function GetDepartmentsByOrgFromApiServer(
  orgId: string
): Promise<DepartmentListResponse> {
  const r = await nestFetch<DepartmentListResponse>(`/departments/${orgId}`, {
    method: "GET",
  });

  if (!r.success) {
    throw Object.assign(new Error(r.message || "Failed to fetch departments"), {
      status: r.status ?? 400,
    });
  }

  return r.data ?? { data: [] };
}

export async function UpdateDepartmentFromApiServer(
  id: string,
  payload: UpdateDepartmentRequest
): Promise<boolean> {
  const r = await nestFetch(`/departments/status`, {
    method: "PATCH",
    body: JSON.stringify({ department_id: id, ...payload }),
    headers: { "Content-Type": "application/json" },
  });

  return r.success;
}
