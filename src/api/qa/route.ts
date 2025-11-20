import ApiClient from "@/lib/api-clients";
import type { GetQaIndicatorsByYearRequest, GetQaIndicatorsByYearAllRespond, GetQaIndicatorsCountsByYear, GetQaIndicatorsDetailsRespond, GetQaIndicatorsRespond, QaRequest, GetQaIndicatorsByYearRespond } from "@/dto/qaDto";
import Cookies from "js-cookie";

export async function GetQaIndicatorsByYearAllFromApi(year: number): Promise<GetQaIndicatorsByYearAllRespond[]> {
    const token = Cookies.get("api_token");
    if (!token) {
        console.warn("No token found in cookies.");
        return [];
    }
    try {
        const response = await ApiClient.get<{
            responseCode?: string;
            responseMessage?: string;
            data?: GetQaIndicatorsByYearAllRespond | GetQaIndicatorsByYearAllRespond[];
        }>(`qa-indicators/organization/year/${year}/all`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        });

        const body = response?.data;
        if (!body) return [];

        if (Array.isArray(body)) {
            return body as GetQaIndicatorsByYearAllRespond[];
        }
        if (Array.isArray(body?.data)) {
            return body.data as GetQaIndicatorsByYearAllRespond[];
        }
        if (body?.data && typeof body.data === "object") {
            return [body.data] as GetQaIndicatorsByYearAllRespond[];
        }
        return [];
    } catch (err) {
        console.error("Error fetching QA indicators:", err);
        return [];
    }
}
export async function GetQaIndicatorsByYearFromApi(
    year: number,
    page: number
): Promise<GetQaIndicatorsByYearRespond[]> {
    const token = Cookies.get("api_token");
    if (!token) {
        console.warn("No token found in cookies.");
        return [];
    }

    try {
        const response = await ApiClient.get<any>(`qa-indicators/organization/year/${year}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
            params: {
                page: Number(page) || 1,
                limit: 10,
            },
        });

        const body = response?.data ?? response;
        if (Array.isArray(body)) {
            return body as GetQaIndicatorsByYearRespond[];
        }

        if (Array.isArray(body?.data)) {
            return body.data as GetQaIndicatorsByYearRespond[];
        }
        if (body?.data && typeof body.data === "object") {
            return [body.data] as GetQaIndicatorsByYearRespond[];
        }
        return [];
    } catch (err) {
        console.error("Error fetching QA indicators:", err);
        return [];
    }
}

export async function GetQaIndicatorsDetailsFromApi(): Promise<GetQaIndicatorsDetailsRespond[]> {
    const token = Cookies.get("api_token");
    if (!token) {
        console.warn("No token found in cookies.");
        return [];
    }
    try {
        const response = await ApiClient.get<{
            responseCode?: string;
            responseMessage?: string;
            data?: GetQaIndicatorsDetailsRespond | GetQaIndicatorsDetailsRespond[];
        }>(`qa-indicators/organization/details`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        });

        const body = response?.data;
        if (!body) return [];
        if (Array.isArray(body)) {
            return body as GetQaIndicatorsDetailsRespond[];
        }
        if (Array.isArray(body?.data)) {
            return body.data as GetQaIndicatorsDetailsRespond[];
        }
        if (body?.data && typeof body.data === "object") {
            return [body.data] as GetQaIndicatorsDetailsRespond[];
        }
        return [];
    } catch (err) {
        console.error("Error fetching QA indicators details:", err);
        return [];
    }
}

export async function GetQaIndicatorsCountsByYearFromApi(): Promise<GetQaIndicatorsCountsByYear[]> {
    const token = Cookies.get("api_token");
    if (!token) {
        console.warn("No token found in cookies.");
        return [];
    }
    try {
        const response = await ApiClient.get<{
            responseCode?: string;
            responseMessage?: string;
            data?: GetQaIndicatorsCountsByYear | GetQaIndicatorsCountsByYear[];
        }>(`qa-indicators/organization/counts-by-year`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        });

        const body = response?.data;
        if (!body) return [];
        if (Array.isArray(body)) {
            return body as GetQaIndicatorsCountsByYear[];
        }
        if (Array.isArray(body?.data)) {
            return body.data as GetQaIndicatorsCountsByYear[];
        }
        if (body?.data && typeof body.data === "object") {
            return [body.data] as GetQaIndicatorsCountsByYear[];
        }
        return [];
    } catch (err) {
        console.error("Error fetching QA indicators details:", err);
        return [];
    }
}
export async function GetQaIndicatorsDetailByIdApi(id: string): Promise<GetQaIndicatorsRespond[]> {
    const token = Cookies.get("api_token");
    if (!token) {
        console.warn("No token found in cookies.");
        return [];
    }

    try {
        const response = await ApiClient.get<{
            responseCode?: string;
            responseMessage?: string;
            data?: GetQaIndicatorsRespond | GetQaIndicatorsRespond[];
        }>(`/qa-indicators/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        });

        const body = response?.data;

        if (!body) return [];

        if (Array.isArray(body)) {
            return body as GetQaIndicatorsRespond[];
        }

        if (body?.data) {
            if (Array.isArray(body.data)) {
                return body.data as GetQaIndicatorsRespond[];
            }
            if (typeof body.data === "object" && body.data !== null) {
                return [body.data as GetQaIndicatorsRespond];
            }
        }

        if (typeof body === "object" && body !== null) {
            if ("id" in body && typeof (body as any).id === "string") {
                console.log("body is single object with id -> returning [body]");
                return [body as unknown as GetQaIndicatorsRespond];
            }
        }

        return [];
    } catch (err) {
        console.error("Error fetching QA indicators details:", err);
        return [];
    }
}


export async function UpdateQaDetailFromApi(
    id: string,
    payload: Partial<QaRequest>
): Promise<boolean> {
    const token = Cookies.get("api_token");
    if (!token) {
        console.warn("No token found in cookies.");
        return false;
    }

    try {
        const response = await ApiClient.put<{
            responseCode?: string;
            responseMessage?: string;
            data?: boolean;
        }>(`qa-indicators/${encodeURIComponent(id)}`, payload, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });
        const body = response?.data;
        if (!body) {
            console.error("Empty response body when updating QA detail");
            return false;
        }
        if (body.responseCode && body.responseCode !== "00") {
            console.error("API returned failure responseCode:", body.responseCode, body.responseMessage);
            return false;
        }
        return true;
    } catch (err) {
        console.error("Error updating QA indicator detail:", err);
        return false;
    }
}
export async function CreateQaFromApi(
    payload: QaRequest
): Promise<boolean> {
    const token = Cookies.get("api_token");
    if (!token) {
        console.warn("No token found in cookies.");
        return false;
    }
    try {
        const response = await ApiClient.post<{
            responseCode?: string;
            responseMessage?: string;
            data?: boolean;
        }>("qa-indicators", payload, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });
        const body = response?.data;
        if (!body) {
            console.error("Empty response body when creating QA indicator");
            return false;
        }
        if (body.responseCode && body.responseCode !== "00") {
            console.error("API returned failure responseCode:", body.responseCode, body.responseMessage);
            return false;
        }
        return true;
    } catch (err) {
        console.error("Error creating QA indicator:", err);
        return false;
    }
}
export async function DeleteQaFromApi(
    id: string
): Promise<boolean> {
    const token = Cookies.get("api_token");
    if (!token) {
        console.warn("No token found in cookies.");
        return false;
    }

    try {
        const response = await ApiClient.delete<{
            responseCode?: string;
            responseMessage?: string;
            data?: boolean;
        }>(`qa-indicators/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        });

        const status = response?.status;
        const body = response?.data;

        // ถ้า server คืน 2xx (รวม 204 No Content) ถือว่า success
        if (status && status >= 200 && status < 300) {
            // ถ้ามี body ให้ตรวจ responseCode ถ้ามี
            if (body) {
                if (body.responseCode && body.responseCode !== "00") {
                    console.error("API returned failure responseCode:", body.responseCode, body.responseMessage);
                    return false;
                }
                // body present and OK
                return true;
            }
            // no body but 2xx => treat as success (e.g., 204 No Content)
            return true;
        }

        // non-2xx without throwing (unlikely with axios) — treat as failure and log
        console.error("Unexpected response while deleting QA indicator", { status, body });
        return false;
    } catch (err: any) {
        // axios error: inspect response if available
        console.error("Error deleting QA indicator:", err);
        if (err?.response) {
            console.error("Delete response status:", err.response.status);
            console.error("Delete response data:", err.response.data);
        }
        return false;
    }
}


export async function SearchQaIndicatorsByNameCode(
  nameCode: string
): Promise<GetQaIndicatorsByYearRespond[]> {
  const token = Cookies.get("api_token");
  if (!token) {
    console.warn("No token found in cookies.");
    return [];
  }

  try {
    const res = await ApiClient.get<any>(`qa-indicators/organization/search`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      params: {
        NameCode: nameCode
      },
    });

    const body = res?.data ?? res;

    // case 1: backend returns array directly
    if (Array.isArray(body)) {
      return body as GetQaIndicatorsByYearRespond[];
    }

    // case 2: backend wraps data under .data
    if (Array.isArray(body?.data)) {
      return body.data as GetQaIndicatorsByYearRespond[];
    }

    // case 3: backend uses other wrappers (e.g., body.data.items)
    if (Array.isArray(body?.data?.items)) {
      return body.data.items as GetQaIndicatorsByYearRespond[];
    }

    // fallback: nothing found or unexpected format
    return [];
  } catch (err) {
    console.error("SearchQaIndicatorsByNameCode error", err);
    return [];
  }
}