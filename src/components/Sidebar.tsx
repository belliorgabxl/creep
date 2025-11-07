// Sidebar.tsx
"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Settings,
  TrendingUp,
  ClipboardList,
  LogOut,
} from "lucide-react";

/** อ่าน cookie แบบง่าย (client only) */
function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()!.split(";").shift() || null;
  return null;
}

/** normalize path เพื่อเทียบ active state */
const normalizePath = (p: string) => {
  if (!p) return "";
  try {
    const base = typeof window !== "undefined" ? window.location.origin : "http://localhost";
    const url = new URL(p, base);
    return url.pathname.replace(/\/+$/g, "");
  } catch {
    return p.replace(/[#?].*$/, "").replace(/\/+$/g, "");
  }
};

export function Sidebar() {
  const nextPathname = usePathname();
  const router = useRouter();

  // ใช้ path จากฝั่ง client เพื่อกัน hydration mismatch
  const [clientPath, setClientPath] = useState<string>("");

  // user info (ชั่วคราวจาก cookie mock; ระบบจริงอ่านจาก /api/auth/me ได้)
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    setClientPath(normalizePath(window.location.pathname || ""));
    const onPop = () => setClientPath(normalizePath(window.location.pathname));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    if (nextPathname) setClientPath(normalizePath(nextPathname));
  }, [nextPathname]);

  useEffect(() => {
    setUsername(getCookie("mock_uid"));
    setRole(getCookie("mock_role"));
  }, []);

  const items = useMemo(
    () => [
      { href: "/user/dashboard", icon: LayoutDashboard, label: "ภาพรวม" },
      { href: "/user/projects/my-project", icon: ClipboardList, label: "โครงการ" },
      { href: "/user/department", icon: Building2, label: "หน่วยงาน" },
      { href: "/user/reports", icon: TrendingUp, label: "รายงาน" },
      { href: "/user/setup", icon: Settings, label: "ตั้งค่า" },
    ],
    []
  );

  /** ลบ cookie ฝั่ง client (เผื่อเคยใช้ mock) */
  function clearCookie(name: string) {
    if (typeof document === "undefined") return;
    document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
  }

  /** ออกจากระบบ: เรียก API เพื่อลบ httpOnly cookies แล้วพาไปหน้า login */
  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      // เผื่อมี mock cookie เก่า ลบทิ้งด้วย
      clearCookie("mock_uid");
      clearCookie("mock_role");
    } catch (e) {
      console.error("Logout error:", e);
      // ถึงจะ error ก็พาผู้ใช้ออกอยู่ดี
    } finally {
      router.replace("/login");
      router.refresh();
    }
  }

  // ถ้าคลิกลิงก์เดิม ให้ replace เพื่อรีเซ็ต lifecycle ของหน้า
  const handleLinkClick = useCallback(
    (href: string) => {
      const nh = normalizePath(href);
      if (clientPath === nh) {
        router.replace(href);
      }
    },
    [clientPath, router]
  );

  const initials = (username ?? "U").slice(0, 2).toUpperCase();
  const roleLabel =
    role === "head"
      ? "หัวหน้า"
      : role === "planning"
      ? "แผนงาน"
      : role === "director"
      ? "ผู้อำนวยการ"
      : role === "admin"
      ? "ผู้ดูแลระบบ"
      : "ผู้ใช้";

  return (
    <aside
      className="
        group fixed left-0 top-0 z-40 hidden h-screen
        bg-white shadow-sm
        md:flex md:flex-col
        w-16 hover:w-64 transition-all duration-300 ease-in-out
      "
      aria-label="Sidebar"
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 min-h-[73px]">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-white">
          <span className="text-sm font-semibold">{initials}</span>
        </div>
        <div className="overflow-hidden opacity-0 transition-all duration-300 group-hover:opacity-100 whitespace-nowrap">
          <div className="text-sm font-semibold text-gray-900">{username || "Guest"}</div>
          <div className="text-xs text-gray-500">{roleLabel}</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-4">
        <div className="space-y-1">
          {items.map(({ href, icon: Icon, label }) => {
            const nh = normalizePath(href);
            const np = clientPath;
            const active = np === nh || np.startsWith(nh + "/");

            return (
              <Link
                key={href}
                href={href}
                onClick={() => handleLinkClick(href)}
                aria-current={active ? "page" : undefined}
                className={`group/item flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200 ${
                  active
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`}
                title={label}
              >
                <Icon className={`h-5 w-5 flex-shrink-0 ${active ? "text-blue-600" : ""}`} />
                <span className="overflow-hidden whitespace-nowrap opacity-0 transition-all duration-300 group-hover:opacity-100">
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Logout */}
      <div className="px-2 py-3">
        <button
          type="button"
          onClick={handleLogout}
          className="
            flex w-full items-center gap-3 rounded-lg px-3 py-2.5
            text-red-600 transition-all duration-200
            hover:bg-red-50 hover:text-red-700
          "
          title="ออกจากระบบ"
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          <span className="overflow-hidden whitespace-nowrap opacity-0 transition-all duration-300 group-hover:opacity-100">
            ออกจากระบบ
          </span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
