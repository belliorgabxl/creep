import type {
  GetCalenderEventRespond,
  GetProjectsByOrgRespond,
  GetApprovalItems,
} from "@/dto/dashboardDto";
import type { GetStrategicPlanRespond, GetQaIndicatorsRespond } from "@/dto/qaDto";
import { clientFetch } from "@/lib/client-api";

export async function GetCalendarEventsFromApi(): Promise<GetCalenderEventRespond[]> {
  const r = await clientFetch<GetCalenderEventRespond[]>("/api/dashboard/calendar-events", {
    cache: "no-store",
  });
  return r.success ? (r.data ?? []) : [];
}

export async function GetApprovalItemsFromApi(): Promise<GetApprovalItems[]> {
  const r = await clientFetch<GetApprovalItems[]>("/api/dashboard/approval-items", {
    cache: "no-store",
  });
  return r.success ? (r.data ?? []) : [];
}

export async function GetStrategicPlansFromApi(): Promise<GetStrategicPlanRespond[]> {
  const r = await clientFetch<GetStrategicPlanRespond[]>("/api/dashboard/strategic-plans", {
    cache: "no-store",
  });
  return r.success ? (r.data ?? []) : [];
}

export async function GetQaIndicatorsFromApi(): Promise<GetQaIndicatorsRespond[]> {
  const r = await clientFetch<GetQaIndicatorsRespond[]>("/api/dashboard/qa-indicators", {
    cache: "no-store",
  });
  return r.success ? (r.data ?? []) : [];
}

export async function GetProjectsByOrgFromApi(): Promise<GetProjectsByOrgRespond[]> {
  const r = await clientFetch<GetProjectsByOrgRespond[]>("/api/dashboard/projects", {
    cache: "no-store",
  });
  return r.success ? (r.data ?? []) : [];
}
