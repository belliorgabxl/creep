import { NextRequest, NextResponse } from "next/server";
import ApiClient from "@/lib/api-clients";
import { decodeExternalJwt, signUserToken } from "@/lib/auth";

const AUTH_COOKIES = ["auth_token", "api_token", "refresh_token", "token_exp"] as const;

function clearSession(res: NextResponse) {
  for (const name of AUTH_COOKIES) {
    res.cookies.set(name, "", { maxAge: 0, path: "/" });
  }
  return res;
}

// Cookie maxAge must reflect each token's own exp claim — see login/route.ts.
function maxAgeFromJwt(token: string | undefined, fallbackSec: number): number {
  if (!token) return fallbackSec;
  const claims = decodeExternalJwt<{ exp?: number }>(token);
  if (typeof claims?.exp !== "number") return fallbackSec;
  const sec = claims.exp - Math.floor(Date.now() / 1000);
  return sec > 0 ? sec : 0;
}

export async function POST(req: NextRequest) {
  const isProd = process.env.NODE_ENV === "production";

  const refreshToken = req.cookies.get("refresh_token")?.value;
  if (!refreshToken) {
    return NextResponse.json({ success: false, message: "No refresh token" }, { status: 401 });
  }

  try {
    const baseURL = process.env.API_BASE_URL || "";
    const res = await ApiClient.post(
      "/auth/refresh",
      { refresh_token: refreshToken },
      { baseURL, timeout: 10000 }
    );

    const data: any = res?.data ?? {};

    const newExternalToken: string = data?.token || data?.access_token || data?.jwt;
    const newRefreshToken: string | undefined = data?.refresh_token;

    if (!newExternalToken) {
      return NextResponse.json({ success: false, message: "No token returned" }, { status: 401 });
    }

    // Decode the backend token to rebuild our frontend JWT (same as login)
    const claims = decodeExternalJwt<any>(newExternalToken) || {};
    const role_code = claims.role_code || claims.role || claims.user_role || "user";
    const role_id = Number(claims.role_id || claims.roleId || 0);
    const approval_level = Number(claims.approval_level || 0);

    const userForOurJwt = {
      sub: (claims.sub as string) || claims.user_id || claims.id || "",
      username: (claims.username as string) || "",
      role: role_code.toLowerCase(),
      role_id,
      approval_level,
      name: (claims.name as string) || claims.fullname || "",
      org_id: claims.org_id || claims.organization_id || undefined,
      department_id: claims.department_id || claims.dept_id || undefined,
    };

    const apiTokenMaxAge = maxAgeFromJwt(newExternalToken, 3600);
    const refreshTokenMaxAge = maxAgeFromJwt(newRefreshToken, 30 * 24 * 3600);
    // Our session wrapper must not outlive the refresh token backing it.
    const authTokenMaxAge = Math.min(apiTokenMaxAge || 3600, refreshTokenMaxAge || 3600);

    const ourJwt = await signUserToken(userForOurJwt, authTokenMaxAge);

    const response = NextResponse.json({ success: true });

    // token_exp readable by JS so SessionGuard can detect approaching expiry —
    // must track api_token's real exp, not the frontend-chosen auth_token TTL.
    response.cookies.set("token_exp", String(Math.floor(Date.now() / 1000) + apiTokenMaxAge), {
      httpOnly: false,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      path: "/",
      maxAge: apiTokenMaxAge,
    });

    response.cookies.set("auth_token", ourJwt, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      path: "/",
      maxAge: authTokenMaxAge,
    });

    response.cookies.set("api_token", newExternalToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      path: "/",
      maxAge: apiTokenMaxAge,
    });

    if (newRefreshToken) {
      response.cookies.set("refresh_token", newRefreshToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        path: "/",
        maxAge: refreshTokenMaxAge,
      });
    }

    return response;
  } catch (err: any) {
    // Only a definitive rejection from the backend (401/403 — refresh token is
    // genuinely invalid or expired) should clear the session. A network error,
    // timeout, or 5xx is transient — clearing cookies here would log the user
    // out for a problem that might resolve on the very next request.
    const status = err?.response?.status;
    const shouldClear = status === 401 || status === 403;

    const resFail = NextResponse.json(
      { success: false, message: "Refresh failed" },
      { status: shouldClear ? 401 : 503 }
    );
    return shouldClear ? clearSession(resFail) : resFail;
  }
}

export async function GET(req: NextRequest) {
  const redirect = req.nextUrl.searchParams.get("redirect") || "/";

  // Forward cookies from incoming request so POST can read them
  const cookieHeader = req.headers.get("cookie") || "";
  const apiRefreshUrl = new URL("/api/auth/refresh", req.url);

  const r = await fetch(apiRefreshUrl.toString(), {
    method: "POST",
    headers: {
      "content-type": "application/json",
      cookie: cookieHeader,
    },
  });

  if (!r.ok) {
    // A transient (503) failure should not force a logout — send the user back
    // to where they were and let the next request retry the refresh.
    if (r.status !== 401) {
      return NextResponse.redirect(new URL(redirect, req.url));
    }
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("reason", "expired");
    return clearSession(NextResponse.redirect(loginUrl));
  }

  const res = NextResponse.redirect(new URL(redirect, req.url));
  for (const cookie of r.headers.getSetCookie()) {
    res.headers.append("set-cookie", cookie);
  }
  return res;
}
