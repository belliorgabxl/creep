"use server";

import ApiClient from "@/lib/api-clients";
import { cookies } from "next/headers";
import type { GetCalenderEventRespond } from "@/dto/dashboardDto";
import { CreateProjectPayload } from "@/dto/projectDto";
import {
  CreateProjectRequest,
  CreateProjectResponse,
} from "@/dto/createProjectDto";

type ApiResp =
  | { success: true; data: any[] }
  | { success: false; message?: string; data: any[] }
  | any[];

export async function getCalendarEvents(): Promise<GetCalenderEventRespond[]> {
  try {
    const token = (await cookies()).get("api_token")?.value;
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await ApiClient.get<ApiResp>("/projects/calendar-events", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    const payload: any = Array.isArray(response.data)
      ? response.data
      : Array.isArray((response.data as any)?.data)
      ? (response.data as any).data
      : [];

    const mapped: GetCalenderEventRespond[] = payload.map((e: any) => ({
      id: String(e.id ?? e._id ?? crypto.randomUUID()),
      title: e.title ?? e.name ?? "Untitled",
      start_date: e.start_date ?? e.start ?? e.begin_date ?? "",
      end_date: e.end_date ?? e.end ?? e.finish_date ?? undefined,
      department: e.department ?? e.dept ?? undefined,
      status: e.status ?? undefined,
      plan_id: e.plan_id ?? undefined,
    }));

    return mapped;
  } catch (error) {
    console.error("[getCalendarEvents] Failed:", error);
    return [];
  }
}

export const createProject = async (
  payload: CreateProjectPayload
): Promise<CreateProjectResponse> => {
  try {
    const body: CreateProjectRequest = {
      project: payload,
    };

    const token = (await cookies()).get("api_token")?.value;

    const res = await ApiClient.post<CreateProjectResponse>(
      `${process.env.EBUDGET_API_BASE_URL}/projects`,
      body,
      {
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );

    if (res.status < 200 || res.status >= 300) {
      throw new Error(`createProject failed: ${res.status} ${res.statusText}`);
    }

    return res.data;
  } catch (error: any) {
    console.error("createProject error:", error);

    if (error.response) {
      throw new Error(
        `API Error ${error.response.status}: ${JSON.stringify(
          error.response.data
        )}`
      );
    }

    throw error;
  }
};
