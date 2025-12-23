import type { Department } from "@/dto/departmentDto";
import { clientFetch } from "@/lib/client-api";

export async function fetchDepartments(): Promise<Department[]> {
  const r = await clientFetch<Department[]>("/api/department");

  if (!r.success) {
    console.error("fetchDepartments error:", r.message);
    return [];
  }

  return r.data ?? [];
}

