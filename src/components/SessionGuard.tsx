"use client";

import { useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

// Inactivity timeout: 30 minutes
const INACTIVE_MS = 30 * 60 * 1000;
// Proactive refresh: if token expires within 5 minutes, refresh now
const REFRESH_BEFORE_EXPIRY_MS = 5 * 60 * 1000;
// How often to check token expiry (every 60 seconds)
const CHECK_INTERVAL_MS = 60 * 1000;

const ACTIVITY_EVENTS = ["mousemove", "keydown", "click", "scroll", "touchstart"] as const;
const LAST_ACTIVITY_KEY = "ebudget_last_activity";

function getTokenExp(): number | null {
  // token_exp is a lightweight non-httpOnly cookie set during login/refresh,
  // tracking api_token's real exp claim (auth_token itself stays httpOnly).
  const match = document.cookie.match(/(?:^|;\s*)token_exp=([^;]+)/);
  if (!match) return null;
  return parseInt(match[1], 10) || null;
}

// Module-scope so every SessionGuard instance (and re-render) shares one
// in-flight refresh — otherwise the periodic check and an activity-triggered
// check can race, and the response that lands second can undo the first.
let inflightRefresh: Promise<boolean> | null = null;

export default function SessionGuard() {
  const router = useRouter();
  const lastActivityRef = useRef<number>(Date.now());
  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const checkIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const logout = useCallback(async () => {
    try {
      localStorage.removeItem(LAST_ACTIVITY_KEY);
    } catch {}
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    // Hard navigation clears all client-side Next.js cache/state, not just the route.
    window.location.replace("/login?reason=inactive");
  }, []);

  const tryRefresh = useCallback(async (): Promise<boolean> => {
    if (inflightRefresh) return inflightRefresh;
    inflightRefresh = (async () => {
      try {
        const res = await fetch("/api/auth/refresh", { method: "POST" });
        return res.ok;
      } catch {
        return false;
      } finally {
        inflightRefresh = null;
      }
    })();
    return inflightRefresh;
  }, []);

  const resetInactivityTimer = useCallback(() => {
    const now = Date.now();
    lastActivityRef.current = now;
    try {
      localStorage.setItem(LAST_ACTIVITY_KEY, String(now));
    } catch {}
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    inactivityTimerRef.current = setTimeout(logout, INACTIVE_MS);
  }, [logout]);

  // Check token expiry periodically and proactively refresh
  const checkAndRefresh = useCallback(async () => {
    const exp = getTokenExp();
    if (exp !== null) {
      const msLeft = exp * 1000 - Date.now();
      if (msLeft <= 0) {
        // Already expired — try refresh
        const ok = await tryRefresh();
        if (!ok) logout();
      } else if (msLeft <= REFRESH_BEFORE_EXPIRY_MS) {
        // Proactively refresh while token still valid
        await tryRefresh();
      }
    } else {
      // No exp cookie — just silently try refresh to probe status
      // (only if user is actively using the app)
      const idleMs = Date.now() - lastActivityRef.current;
      if (idleMs < INACTIVE_MS) {
        const ok = await tryRefresh();
        if (!ok) {
          // Refresh failed: middleware will redirect on next navigation
          // Don't force-logout here; let middleware handle it
        }
      }
    }
  }, [tryRefresh, logout]);

  useEffect(() => {
    // If the tab was closed/reloaded past the inactivity window, honor that
    // instead of granting a fresh INACTIVE_MS on every reload.
    let saved = 0;
    try {
      saved = Number(localStorage.getItem(LAST_ACTIVITY_KEY) || 0);
    } catch {}
    if (saved && Date.now() - saved >= INACTIVE_MS) {
      logout();
      return;
    }

    // Start inactivity timer
    resetInactivityTimer();

    // Attach activity listeners
    const handleActivity = () => resetInactivityTimer();
    ACTIVITY_EVENTS.forEach((e) => window.addEventListener(e, handleActivity, { passive: true }));

    // Periodic token check
    checkIntervalRef.current = setInterval(checkAndRefresh, CHECK_INTERVAL_MS);

    return () => {
      ACTIVITY_EVENTS.forEach((e) => window.removeEventListener(e, handleActivity));
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);
    };
  }, [resetInactivityTimer, checkAndRefresh, logout]);

  return null;
}
