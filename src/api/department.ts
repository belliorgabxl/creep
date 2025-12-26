import type { Department } from "@/dto/departmentDto";
import { clientFetch } from "@/lib/client-api";

export async function fetchDepartments(): Promise<Department[]> {
  const r = await clientFetch<{ data?: Department[] } | Department[]>("/departments", { cache: "no-store" });
  if (!r.success) return [];
  const body = r.data as any;
  return Array.isArray(body) ? body : (body?.data ?? []);
}

export async function GetDepartmentsDetailByIdFromApi(id: string): Promise<Department[]> {
  const r = await clientFetch<Department[]>(`/api/department/detail/${encodeURIComponent(id)}`, { cache: "no-store" });
  return r.success ? (r.data ?? []) : [];
}
