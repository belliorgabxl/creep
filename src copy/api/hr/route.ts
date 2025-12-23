import ApiClient from "@/lib/api-clients";
import type {GetUserRespond } from "@/dto/userDto";
import Cookies from "js-cookie";

export type UserListPage = { items: GetUserRespond[]; total: number; page?: number; limit?: number };

export async function GetUserByOrgFromApi(page: number = 1, limit: number = 10): Promise<UserListPage> {
  const token = Cookies.get("api_token");
  if (!token) return { items: [], total: 0 };

  try {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) }).toString();
    const response = await ApiClient.get(`/users/organization?${params}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    });

    const body = response?.data ?? {};
    const items: GetUserRespond[] = Array.isArray(body.data) ? body.data : Array.isArray(body.items) ? body.items : [];
    const total =
      (body.pagination && Number.isFinite(body.pagination.total) && Number(body.pagination.total)) ??
      (typeof body.total === "number" ? body.total : items.length);

    return { items, total: Number(total || 0), page: body.pagination?.page ?? page, limit: body.pagination?.limit ?? limit };
  } catch (err) {
    console.error("GetUserByOrgFromApi error", err);
    return { items: [], total: 0 };
  }
}



export async function GetUserByIdFromApi(id: string): Promise<GetUserRespond[]> {
    const token = Cookies.get("api_token");
    if (!token) {
        console.warn("No token found in cookies.");
        return [];
    }

    try {
        const response = await ApiClient.get<{
            responseCode?: string;
            responseMessage?: string;
            data?: GetUserRespond | GetUserRespond[];
        }>(`users/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        });

        const body = response?.data;

        if (!body) return [];

        if (Array.isArray(body)) {
            return body as GetUserRespond[];
        }

        if (body?.data) {
            if (Array.isArray(body.data)) {
                return body.data as GetUserRespond[];
            }
            if (typeof body.data === "object" && body.data !== null) {
                return [body.data as GetUserRespond];
            }
        }

        if (typeof body === "object" && body !== null) {
            if ("id" in body && typeof (body as any).id === "string") {
                console.log("body is single object with id -> returning [body]");
                return [body as unknown as GetUserRespond];
            }
        }

        return [];
    } catch (err) {
        console.error("Error fetching QA indicators details:", err);
        return [];
    }
}



export async function GetUserByDepartmentIdFromApi(department_id: string): Promise<GetUserRespond[]> {
    const token = Cookies.get("api_token");
    if (!token) {
        console.warn("No token found in cookies.");
        return [];
    }

    try {
        const response = await ApiClient.get<{
            responseCode?: string;
            responseMessage?: string;
            data?: GetUserRespond | GetUserRespond[];
        }>(`users/organization/${department_id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        });

        const body = response?.data;

        if (!body) return [];

        if (Array.isArray(body)) {
            return body as GetUserRespond[];
        }

        if (body?.data) {
            if (Array.isArray(body.data)) {
                return body.data as GetUserRespond[];
            }
            if (typeof body.data === "object" && body.data !== null) {
                return [body.data as GetUserRespond];
            }
        }

        if (typeof body === "object" && body !== null) {
            if ("id" in body && typeof (body as any).id === "string") {
                console.log("body is single object with id -> returning [body]");
                return [body as unknown as GetUserRespond];
            }
        }

        return [];
    } catch (err) {
        console.error("Error fetching QA indicators details:", err);
        return [];
    }
}