"use client";

import SciFiBackgroundNormal from "@/components/background/bg-normal";
import { HandCoins } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {

      await new Promise((r) => setTimeout(r, 900)); 
    } 
/* eslint-disable @typescript-eslint/no-explicit-any */
    catch (err: any) {
      setError(err?.message || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsLoading(false);
    }
  }

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
                    <HandCoins className="text-indigo-600 w-6 h-6 "/>
                  </div>
                  <div>
                    <h1 className="text-xl font-semibold tracking-tight text-slate-900">E-Budget</h1>
                    <p className="text-sm text-slate-600">ลงชื่อเข้าใช้ด้วยบัญชีของคุณ</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="grid gap-4" noValidate>
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-slate-700">
                      ชื่อผู้ใช้
                    </label>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      autoComplete="username"
                      inputMode="text"
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-200"
                      placeholder="ชื่อผู้ใช้ของคุณ"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                        รหัสผ่าน
                      </label>
                      <a href="#" className="text-xs text-slate-600 hover:text-slate-800">
                        ลืมรหัสผ่าน?
                      </a>
                    </div>
                    <div className="mt-2 relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 pr-12 text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-200"
                        placeholder="รหัสผ่านของคุณ"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs text-slate-600 hover:bg-slate-100 focus:outline-none"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? "ซ่อน" : "แสดง"}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="inline-flex items-center gap-2 select-none text-sm text-slate-700">
                      <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-slate-700 focus:ring-slate-300" />
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
                    disabled={isLoading || !username || !password}
                    className="group relative inline-flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-blue-900 to-indigo-800 px-4 text-sm font-medium text-white shadow transition active:scale-[0.99] disabled:opacity-80"
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
