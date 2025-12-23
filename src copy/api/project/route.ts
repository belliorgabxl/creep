import ApiClient from "@/lib/api-clients";
import Cookies from "js-cookie";
import type { GetCalenderEventRespond } from "@/dto/dashboardDto";
import {
  CreateProjectPayload,
  CreateProjectRequest,
  CreateProjectResponse,
} from "@/dto/createProjectDto";
import { ProjectInformationResponse } from "@/dto/projectDto";

type ApiResp =
  | { success: true; data: any[] }
  | { success: false; message?: string; data: any[] }
  | any[];

export async function getCalendarEvents(): Promise<GetCalenderEventRespond[]> {
  try {
    const token = Cookies.get("api_token");
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

// export const createProject = async (
//   payload: CreateProjectPayload
// ): Promise<CreateProjectResponse> => {
//   try {
//     const body: CreateProjectRequest = {
//       project: payload,
//     };

//     const accessToken = Cookies.get("api_token");

//     const res = await ApiClient.post<CreateProjectResponse>(`/projects/`, body, {
//       headers: {
//         accept: "application/json",
//         "content-type": "application/json",
//         authorization: `Bearer ${accessToken}`,
//       },
//       withCredentials: true,
//     });

//     if (res.status < 200 || res.status >= 300) {
//       throw new Error(`createProject failed: ${res.status} ${res.statusText}`);
//     }
//     console.log(res)

//     return res.data;
//   } catch (error: any) {
//     console.error("createProject error:", error);

//     if (error.response) {
//       throw new Error(
//         `API Error ${error.response.status}: ${JSON.stringify(
//           error.response.data
//         )}`
//       );
//     }

//     throw error;
//   }
// };
export const createProject = async (
  payload: CreateProjectPayload
): Promise<CreateProjectResponse> => {
  const accessToken = Cookies.get("api_token");

  try {
    const body: CreateProjectRequest = payload;

    const res = await fetch(
      `https://e-budget-api.usefulapps.app/api/v1/projects/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
      }
    );

    if (!res.ok) {
      let errorBody: any = null;
      try {
        errorBody = await res.json();
      } catch {
        errorBody = await res.text();
      }
      throw new Error(`API Error ${res.status}: ${JSON.stringify(errorBody)}`);
    }

    let data: CreateProjectResponse | null = null;
    try {
      data = (await res.json()) as CreateProjectResponse;
    } catch (e) {
      console.warn(
        "createProject: cannot parse JSON body, but request was OK",
        e
      );
    }
    if (!data) {
      data = {
        message: "Project created successfully",
      } as CreateProjectResponse;
    }
    console.log(res);
    console.log(data);

    return data;
  } catch (err: any) {
    console.error("createProject fetch error:", err);
    throw err;
  }
};


export const fetchProjectInformation = async (
  projectId: string,
  accessToken: string
): Promise<ProjectInformationResponse> => {
  const res = await ApiClient.get<ProjectInformationResponse>(
    "/projects/information",
    {
      params: {
        project_id: projectId,
      },
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return res.data;
};