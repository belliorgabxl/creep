type ApiOk<T> = { success: true; data: T };
type ApiFail = { success: false; message?: string };
export type ApiResult<T> = ApiOk<T> | ApiFail;

export async function clientFetch<T>(
  path: string,
  init?: RequestInit
): Promise<ApiResult<T>> {
  try {
    const res = await fetch(path, {
      ...init,
      headers: { Accept: "application/json", ...(init?.headers ?? {}) },
    });
    const json = await res.json().catch(() => null);

    if (!res.ok) {
      return { success: false, message: json?.message ?? `HTTP ${res.status}` };
    }
    return { success: true, data: json?.data ?? json };
  } catch (e: any) {
    return { success: false, message: e?.message ?? "Network error" };
  }
}
