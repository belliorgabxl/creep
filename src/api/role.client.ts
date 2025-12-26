import type { RoleRespond } from "@/dto/roleDto";
import { clientFetch } from "@/lib/client-api";


export async function GetRoleFromApi(): Promise<RoleRespond[]> {
  const r = await clientFetch<{ data?: RoleRespond[] } | RoleRespond[]>(
    "/api/roles",
    { cache: "no-store" }
  );

  if (!r.success) {
    console.error("GetRoleFromApi error", r.message);
    return [];
  }

  const body = r.data as any;

  return Array.isArray(body)
    ? body
    : Array.isArray(body?.data)
    ? body.data
    : [];
}
