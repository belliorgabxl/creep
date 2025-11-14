import ApiClient from "@/lib/api-clients";
import type { GetCalenderEventRespond, GetProjectsByOrgRespond,GetApprovalItems,GetQaIndicatorsRespond,GetStrategicPlanRespond } from "@/dto/dashboardDto";
import Cookies from "js-cookie";

export async function GetCalendarEventsFromApi(): Promise<GetCalenderEventRespond[]> {
  const token = Cookies.get("api_token");
  if (!token) {
    console.warn("[GetCalendarEventsFromApi] No token found in cookies.");
    return [];
  }

  try {
    const response = await ApiClient.get("projects/calendar-events", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    console.debug("[GetCalendarEventsFromApi] status:", response.status);
    console.debug("[GetCalendarEventsFromApi] raw data:", response.data);

    const body = response?.data;
    if (Array.isArray(body)) {
      return body as GetCalenderEventRespond[];
    }

    if (body && typeof body === "object" && (body as any).data !== undefined) {
      const payload = (body as any).data;
      if (!payload) return [];
      return Array.isArray(payload) ? (payload as GetCalenderEventRespond[]) : [payload as GetCalenderEventRespond];
    }
    if (body && typeof body === "object") {
      console.debug("[GetCalendarEventsFromApi] detected single object response");
      return [body as GetCalenderEventRespond];
    }
    return [];
  } catch (err: any) {
    if (err?.response) {
      console.error("[GetCalendarEventsFromApi] API error:", err.response.status, err.response.data);
    } else {
      console.error("[GetCalendarEventsFromApi] Error:", err);
    }
    return [];
  }
}


export async function GetApprovalItemsFromApi(): Promise<GetApprovalItems[]> {
    const token = Cookies.get("api_token");
    if (!token) {
        console.warn("No token found in cookies.");
        return [];
    }
    try {
        const response = await ApiClient.get<{
            responseCode?: string;
            responseMessage?: string;
            data?: GetApprovalItems | GetApprovalItems[];
        }>("budget-plans/approval-items", {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        });

        const body = response?.data;
        if (!body) return [];

        const payload = body.data;

        if (!payload) return [];
        if (Array.isArray(payload)) return payload;
        return [payload];
    } catch (err) {
        console.error("Error fetching approval budget plans:", err);
        return [];
    }
}

export async function GetStrategicPlansFromApi(): Promise<GetStrategicPlanRespond[]> {
    const token = Cookies.get("api_token");
    if (!token) {
        console.warn("No token found in cookies.");
        return [];
    }
    try {
        const response = await ApiClient.get<{
            responseCode?: string;
            responseMessage?: string;
            data?: GetStrategicPlanRespond | GetStrategicPlanRespond[];
        }>("strategic-plans/organization", {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        });

        const body = response?.data;
        if (!body) return [];

        const payload = body.data;

        if (!payload) return [];
        if (Array.isArray(payload)) return payload;
        return [payload];
    } catch (err) {
        console.error("Error fetching strategic plans:", err);
        return [];
    }
}

export async function GetQaIndicatorsFromApi(): Promise<GetQaIndicatorsRespond[]> {
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
        }>("qa-indicators/organization", {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        });

        const body = response?.data;
        if (!body) return [];

        const payload = body.data;

        if (!payload) return [];
        if (Array.isArray(payload)) return payload;
        return [payload];
    } catch (err) {
        console.error("Error fetching QA indicators:", err);
        return [];
    }
}

export async function GetProjectsByOrgFromApi(): Promise<GetProjectsByOrgRespond[]> {
    try {
        const token = Cookies.get("api_token");
        const response = await ApiClient.get("projects", {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        });

        const body = response?.data;
        if (!body) return [];
        if (Array.isArray(body)) return body as GetProjectsByOrgRespond[];
        if ((body as any).data !== undefined) {
            const payload = (body as any).data;
            if (!payload) return [];
            if (Array.isArray(payload)) return payload as GetProjectsByOrgRespond[];
            return [payload as GetProjectsByOrgRespond];
        }
        if (typeof body === "object") return [body as GetProjectsByOrgRespond];

        return [];
    } catch (err) {
        console.error("[getProjectsByOrg] Error:", err);
        return [];
    }
}
