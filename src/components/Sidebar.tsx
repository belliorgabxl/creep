// components/Sidebar.tsx
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

type MeResponse =
  | {
      authenticated: true;
      user: {
        id: string;
        username: string;
        name?: string;
        role_key: string;             
        role_id: number | null;    
        role_label: string | null;    
        org_id?: string | null;
        department_id?: string | null;
      };
    }
  | { authenticated: false; message?: string };

export function Sidebar() {
  const nextPathname = usePathname();
  const router = useRouter();

  /** ป้องกัน hydration mismatch: ใช้ path จากฝั่ง client */
  const [clientPath, setClientPath] = useState<string>("");

  /** สถานะผู้ใช้งาน */
  const [username, setUsername] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [roleLabel, setRoleLabel] = useState<string>("ผู้ใช้");
  const [loadingMe, setLoadingMe] = useState<boolean>(true);

  // ติดตาม path เมื่อผู้ใช้กด back/forward
  useEffect(() => {
    setClientPath(normalizePath(window.location.pathname || ""));
    const onPop = () => setClientPath(normalizePath(window.location.pathname));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    if (nextPathname) setClientPath(normalizePath(nextPathname));
  }, [nextPathname]);

  // โหลดข้อมูลผู้ใช้จาก /api/auth/me (อ่านจาก httpOnly cookie)
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoadingMe(true);
        const res = await fetch("/api/auth/me", {
          method: "GET",
          headers: { Accept: "application/json" },
          cache: "no-store",
        });

        if (!res.ok) {
          if (active) {
            setUsername(null);
            setDisplayName(null);
            setRoleLabel("ผู้ใช้");
          }
          if (res.status === 401) {
            // แนบ redirect ปัจจุบันกลับไปหน้า login
            const url = new URL("/login", window.location.href);
            url.searchParams.set("redirect", window.location.pathname + window.location.search);
            router.replace(url.toString());
          }
          return;
        }

        const data = (await res.json()) as MeResponse;
        if (active && "authenticated" in data && data.authenticated) {
          const u = data.user;
          setUsername(u.username);
          setDisplayName(u.name ?? u.username);
          setRoleLabel(u.role_label ?? "ผู้ใช้");
        }
      } catch {
        if (active) {
          setUsername(null);
          setDisplayName(null);
          setRoleLabel("ผู้ใช้");
        }
      } finally {
        if (active) setLoadingMe(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [router]);

  /** รายการเมนู (ถ้าต้องการซ่อน/แสดงตาม role ค่อยเติมเงื่อนไขที่นี่) */
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

  /** ออกจากระบบ: เรียก API เพื่อลบ httpOnly cookies แล้วพาไปหน้า login */
  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      console.error("Logout error:", e);
    } finally {
      router.replace("/login");
      router.refresh();
    }
  }

  /** ถ้าคลิกลิงก์เดิม ให้ replace เพื่อรีเซ็ต lifecycle ของหน้า */
  const handleLinkClick = useCallback(
    (href: string) => {
      const nh = normalizePath(href);
      if (clientPath === nh) {
        router.replace(href);
      }
    },
    [clientPath, router]
  );

  const initials = (displayName ?? username ?? "U").slice(0, 2).toUpperCase();

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
          <div className="text-sm font-semibold text-gray-900">
            {loadingMe ? "กำลังโหลด..." : displayName || username || "Guest"}
          </div>
          <div className="text-xs text-gray-500">
            {loadingMe ? " " : roleLabel}
          </div>
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
    </aside>
  );
}

export default Sidebar;
