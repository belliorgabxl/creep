"use server";

type ApiOk<T> = { success: true; data: T } | (T extends any[] ? T : never);
type ApiErr = { success: false; message?: string };

type JsonBody = Record<string, any> | undefined;

async function api<T>(
  path: string,
  init?: RequestInit & { json?: JsonBody; form?: FormData }
): Promise<T | ApiErr> {
  try {
    const headers: Record<string, string> = {
      Accept: "application/json",
      ...(init?.headers as Record<string, string> ?? {}),
    };

    let body: BodyInit | undefined = undefined;
    if (init?.form) {
      body = init.form;
    } 
    else if (init?.json !== undefined) {
      headers["Content-Type"] = "application/json";
      body = JSON.stringify(init.json);
    }

    const r = await fetch(`/api/${path}`, {
      cache: "no-store",
      credentials: "include",
      ...init,
      headers,    
      body,
    });

    if (r.status === 204) {
      // @ts-expect-error — no data return
      return undefined;
    }

    const text = await r.text();
    const data = text ? JSON.parse(text) : null;

    if (!r.ok) {
      return {
        success: false,
        message: data?.message || `Request failed (${r.status})`,
      };
    }

    return data as T;

  } catch (e: any) {
    return { success: false, message: e?.message || "Network error" };
  }
}


/** ---------- GET ---------- */
export function getProjects() {
  return api<ApiOk<any[]>>("projects");
}
export function getProjectCalendarEvents() {
  return api<ApiOk<any[]>>("projects/calendar-events");
}
export function getBudgetApprovalItems() {
  return api<ApiOk<any[]>>("budget-plans/approval-items");
}

/** ---------- ex POST ---------- */
// export function postProject(payload: Record<string, any>) {
//   return api<ApiOk<any>>("projects", { method: "POST", json: payload });
// }

// /** ---------- ex PUT ---------- */
// export function putProject(id: string, payload: Record<string, any>) {
//   return api<ApiOk<any>>(`projects/${id}`, { method: "PUT", json: payload });
// }

// /** ---------- ex PATCH ---------- */
// export function patchProject(id: string, partial: Record<string, any>) {
//   return api<ApiOk<any>>(`projects/${id}`, { method: "PATCH", json: partial });
// }

// /** ---------- ex DELETE ---------- */
// // ส่วนใหญ่ไม่ต้องมี body; ถ้าจำเป็นก็ส่งผ่าน option json ได้
// export function deleteProject(id: string, body?: Record<string, any>) {
//   return api<void | ApiOk<any>>(`projects/${id}`, {
//     method: "DELETE",
//     ...(body ? { json: body } : {}),
//   });
// }