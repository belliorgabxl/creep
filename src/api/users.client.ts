import type {
  CreateUserRequest,
  UpdateUserRequest,
  UpdateUserStatusRequest,
  GetUserRespond,
} from "@/dto/userDto";
import { clientFetch } from "@/lib/client-api";
/* -------------------- query -------------------- */

/**
 * GET /api/users/organization?page=&limit=&status=
 */
export type UserListPage = {
  items: GetUserRespond[];
  total: number;
  page: number;
  limit: number;
  total_pages: number; // จาก API เท่านั้น
};

export async function GetUserByOrgFromApi(
  page: number = 1,
  limit: number = 10,
  filter: "all" | "active" | "inactive" = "all"
): Promise<UserListPage> {
  try {
    // Validate inputs
    const validPage = Math.max(1, Math.floor(page));
    const validLimit = Math.min(100, Math.max(1, Math.floor(limit)));

    const qs = new URLSearchParams({
      page: String(validPage),
      limit: String(validLimit),
    });

    if (filter !== "all") {
      qs.set("status", filter);
    }

    const r = await clientFetch<{
      data: GetUserRespond[];
      total: number;
      page: number;
      limit: number;
      total_pages: number;
      pagination?: {
        page: number;
        limit: number;
        total: number;
        total_pages: number;
      };
    }>(`/api/users/organization?${qs.toString()}`, { cache: "no-store" });

    if (!r.success) {
      console.warn("[GetUserByOrgFromApi] API call failed:", r);
      return {
        items: [],
        total: 0,
        page: validPage,
        limit: validLimit,
        total_pages: 0,
      };
    }

    const body = r.data;

    // Parse response with fallbacks
    const items = Array.isArray(body.data) ? body.data : [];
    const total = typeof body.total === "number" ? body.total : 0;
    const respPage = typeof body.page === "number" ? body.page : validPage;
    const respLimit = typeof body.limit === "number" ? body.limit : validLimit;
    const totalPages = typeof body.total_pages === "number" ? body.total_pages : Math.ceil(total / respLimit);

    return {
      items,
      total,
      page: respPage,
      limit: respLimit,
      total_pages: totalPages,
    };
  } catch (error) {
    console.error("[GetUserByOrgFromApi] Error:", error);
    return {
      items: [],
      total: 0,
      page: Math.max(1, page),
      limit: Math.max(1, limit),
      total_pages: 0,
    };
  }
}


export async function GetUserByIdFromApi(
  user_id: string
): Promise<GetUserRespond | null> {
  const r = await clientFetch<any>(`/api/users/${user_id}`, {
    cache: "no-store",
  });

  if (!r.success) return null;

  const body = r.data;
  if (!body) return null;

  if (body.data && typeof body.data === "object") {
    return body.data as GetUserRespond;
  }

  if (typeof body === "object") {
    return body as GetUserRespond;
  }

  return null;
}


/**
 * Return all users (helper for selects). Uses a large `limit` to attempt to fetch all rows.
 */
export async function GetAllUsers(): Promise<GetUserRespond[]> {
  const r = await GetUserByOrgFromApi(1, 1000);
  return r.items ?? [];
}

/**
 * Call server change-password route which uses HttpOnly cookie for auth.
 */
export async function ChangePassword(currentPassword: string, newPassword: string): Promise<string> {
  try {
    const res = await fetch("/api/users/change-password", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
    });

    if (!res.ok) {
      const json = await res.json().catch(() => null);
      throw new Error(json?.message ?? `HTTP ${res.status}`);
    }

    const json = await res.json().catch(() => null);
    return json?.data?.message ?? json?.message ?? "เปลี่ยนรหัสผ่านสำเร็จ";
  } catch (err: any) {
    throw new Error(err?.message ?? "Failed to change password");
  }
}

/* -------------------- mutations -------------------- */

/**
 * POST /api/users
 */
export async function CreateUserFromApi(
  payload: CreateUserRequest
): Promise<{ ok: boolean; status: number; data?: any; message?: string }> {
  try {
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    });

    const body = await res.json().catch(() => null);
    if (!res.ok) {
      return { ok: false, status: res.status, data: body, message: body?.message ?? body?.responseMessage ?? `HTTP ${res.status}` };
    }

    // successful create
    return { ok: true, status: res.status, data: body?.data ?? body };
  } catch (err: any) {
    return { ok: false, status: 0, message: err?.message ?? "Network error" };
  }
}

/**
 * PATCH /api/users/status
 */
export async function UpdateUserStatusFromApi(
  payload: UpdateUserStatusRequest
): Promise<boolean> {
  const r = await clientFetch("/api/users/status", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

  return r.success;
}

/**
 * PATCH /api/users/details
 */
export async function UpdateUserFromApi(
  payload: UpdateUserRequest
): Promise<boolean> {
  const r = await clientFetch("/api/users/details", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

  return r.success;
}
