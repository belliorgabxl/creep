"use client";

import SciFiBackgroundNormal from "@/components/background/bg-normal";
import { HandCoins } from "lucide-react";
import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { pickHomeByRole } from "@/lib/rbac";

type Me = {
  id: string;
  name?: string;
  role?: string;
  org_id?: string;
  department_id?: string;
};

/** อนุญาต redirect เฉพาะ path ภายในเท่านั้น */
function safeInternalRedirect(path?: string | null): string | null {
  if (!path) return null;
  try {

    if (!path.startsWith("/")) return null;

    if (path.startsWith("//")) return null;

    if (path.toLowerCase().startsWith("/javascript:")) return null;
    return path;
  } catch {
    return null;
  }
}

async function fetchMe(): Promise<Me | null> {
  try {
    const r = await fetch("/api/auth/me", { method: "GET", credentials: "include" });
    if (!r.ok) return null;
    const data = await r.json();
    const me = (data?.data ?? data) as Me | undefined;
    if (!me?.id) return null;
    return me;
  } catch {
    return null;
  }
}

function LoginInner() {
  const router = useRouter();
  const sp = useSearchParams();

  const redirectParam =
    safeInternalRedirect(sp.get("redirect")) ??
    safeInternalRedirect(sp.get("callbackUrl"));

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [capsOn, setCapsOn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("ebudget_login");
    if (saved) {
      try {
        const p = JSON.parse(saved) as { username: string };
        if (p?.username) {
          setUsername(p.username);
          setRemember(true);
        }
      } catch {}
    }
  }, []);

  useEffect(() => {
    const hasToken = document.cookie.split("; ").some((c) => c.startsWith("auth_token="));
    if (!hasToken) return;

    (async () => {
      const me = await fetchMe();
      if (me?.role) {
        router.replace(pickHomeByRole(me.role));
      }
    })();
  }, [router]);

  function onKeyEvent(e: React.KeyboardEvent<HTMLInputElement>) {
    if ("getModifierState" in e) setCapsOn(e.getModifierState("CapsLock"));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data?.success) {
        throw new Error(data?.message || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
      }

      if (remember) {
        localStorage.setItem("ebudget_login", JSON.stringify({ username }));
      } else {
        localStorage.removeItem("ebudget_login");
      }
      const target =
        redirectParam ??
        pickHomeByRole((await fetchMe())?.role); 

      router.replace(target);
    } catch (err: any) {
      setError(err?.message || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsLoading(false);
    }
  }

  const canSubmit = useMemo(
    () => !!username.trim() && !!password.trim() && !isLoading,
    [username, password, isLoading]
  );

  return (
    <div className="min-h-[100dvh] w-full">
      <SciFiBackgroundNormal>
        <div className="min-h-[100dvh] grid place-items-center px-4">
          <div className="w-full max-w-md">
            <div className="relative rounded-3xl border border-white/20 bg-white/70 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
              <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-slate-900/5"></div>

              <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-full flex items-center justify-center border-2 border-indigo-600">
                    <HandCoins className="text-indigo-600 w-6 h-6 " />
                  </div>
                  <div>
                    <h1 className="text-xl font-semibold tracking-tight text-slate-900">E-Budget</h1>
                    <p className="text-sm text-slate-600">ลงชื่อเข้าใช้ด้วยบัญชีของคุณ</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="grid gap-4" noValidate autoComplete="off">
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-slate-700">
                      ชื่อผู้ใช้
                    </label>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      inputMode="text"
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-200"
                      placeholder="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      disabled={isLoading}
                      onKeyUp={onKeyEvent}
                      onKeyDown={onKeyEvent}
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                      รหัสผ่าน
                    </label>
                    <div className="mt-2 relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 pr-20 text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-200"
                        placeholder="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                        minLength={4}
                        onKeyUp={onKeyEvent}
                        onKeyDown={onKeyEvent}
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        {capsOn && (
                          <span className="text-[10px] text-amber-700 bg-amber-100 rounded px-1.5 py-0.5">
                            CAPS
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          className="rounded-lg px-2 py-1 text-xs text-slate-600 hover:bg-slate-100 focus:outline-none"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                          disabled={isLoading}
                        >
                          {showPassword ? "ซ่อน" : "แสดง"}
                        </button>
                      </div>
                    </div>

                    <div className="mt-2">
                      <Link href="/forgot-password" className="text-xs text-slate-600 hover:text-slate-800">
                        ลืมรหัสผ่าน?
                      </Link>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="inline-flex items-center gap-2 select-none text-sm text-slate-700">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-slate-300 text-slate-700 focus:ring-slate-300"
                        checked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                        disabled={isLoading}
                      />
                      จดจำการเข้าสู่ระบบ
                    </label>
                  </div>

                  {error && (
                    <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className="group relative inline-flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-blue-900 to-indigo-800 px-4 text-sm font-medium text-white shadow transition active:scale-[0.99] disabled:opacity-80 disabled:cursor-not-allowed"
                  >
                    <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-slate-900 to-slate-700 opacity-0 transition group-hover:opacity-100" />
                    <span className="relative">
                      {isLoading ? "กำลังเข้าสู่ระบบ…" : "เข้าสู่ระบบ"}
                    </span>
                  </button>
                </form>

                <div className="mt-6 border-t border-slate-200 pt-4">
                  <p className="text-xs leading-relaxed text-slate-500">
                    การเข้าถึงระบบนี้สงวนไว้สำหรับพนักงานที่ได้รับอนุญาตเท่านั้น การใช้งานทั้งหมดอาจถูกตรวจสอบและบันทึกตามนโยบายความปลอดภัยขององค์กร
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-6 text-center text-xs text-white/80">
              © {new Date().getFullYear()} E-Budget. All rights reserved.
            </p>
          </div>
        </div>
      </SciFiBackgroundNormal>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh" />}>
      <LoginInner />
    </Suspense>
  );
}
