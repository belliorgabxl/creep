import Cookies from "js-cookie";
import ApiClient from "@/lib/api-clients";
import { GetCalenderEventRespond } from "@/api/model/project";
import { GetApprovalItems } from "@/api/model/budget-plan";
import { GetStrategicPlanRespond } from "@/api/model/strategic-plans";

export const getCalendarEvents = async (): Promise<GetCalenderEventRespond[]> => {
  const token = Cookies.get("api_token");
  if (!token) {
    console.warn("No token found in cookies.");
    return [];
  }

  try {
    const response = await ApiClient.get<{
      responseCode?: string;
      responseMessage?: string;
      data?: GetCalenderEventRespond | GetCalenderEventRespond[];
    }>("projects/calendar-events", {
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
    console.error("Error fetching calendar events:", err);
    return [];
  }
};

export const getApprovalBudgetPlans = async (): Promise<GetApprovalItems[]> => {
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
};

export const getStrategicPlans = async (): Promise<GetStrategicPlanRespond[]> => {
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
};