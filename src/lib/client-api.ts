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

    if (res.status === 401) {
      if (typeof window !== "undefined") {
        // A dead backend session (api_token/refresh_token) can coexist with a
        // still-valid auth_token — our own wrapper JWT outlives what it wraps
        // (e.g. right after a breaking auth deploy on an already-open tab).
        // Middleware only checks auth_token, so redirecting to /login without
        // clearing cookies first bounces straight back to the app and loops.
        // Clear the session cookies before navigating so /login actually sticks.
        await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
        window.location.href = "/login?reason=expired";
      }
      return { success: false, message: "Unauthenticated" } as any;
    }
    
    const json = await res.json().catch(() => null);

    if (!res.ok) {
      return { success: false, message: json?.message ?? `HTTP ${res.status}` };
    }
    return { success: true, data: json?.data ?? json };
  } catch (e: any) {
    return { success: false, message: e?.message ?? "Network error" };
  }
}

export async function clientFetchArray<T>(
  path: string,
  init?: RequestInit
): Promise<ApiResult<T>> {
  try {
    const res = await fetch(path, {
      ...init,
      headers: { Accept: "application/json", ...(init?.headers ?? {}) },
    });

    if (res.status === 401) {
      if (typeof window !== "undefined") {
        // See clientFetch — must clear session cookies before navigating,
        // or a still-valid auth_token bounces straight back from /login.
        await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
        window.location.href = "/login?reason=expired";
      }
      return { success: false, message: "Unauthenticated" };
    }

    const json = await res.json().catch(() => null);

    if (!res.ok) {
      return { success: false, message: json?.message ?? `HTTP ${res.status}` };
    }
    return { success: true, data: json };
  } catch (e: any) {
    return { success: false, message: e?.message ?? "Network error" };
  }
}
