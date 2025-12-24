// components/Sidebar.tsx
"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Settings,
  TrendingUp,
  ClipboardList,
  LogOut,
  Users,
} from "lucide-react";
import { pickHomeByRole } from "@/lib/rbac";

type ServerUser = {
  id?: string | null;
  username?: string | null;
  name?: string | null;
  role_key?: string | null;
  role_label?: string | null;
  org_id?: string | null;
  department_id?: string | null;
} | null;


const normalizePath = (p: string) => {
  if (!p) return "";
  try {
    const base =
      typeof window !== "undefined" ? window.location.origin : "http://localhost";
    const url = new URL(p, base);
    return url.pathname.replace(/\/+$/g, "");
  } catch {
    return p.replace(/[#?].*$/, "").replace(/\/+$/g, "");
  }
};

export default function Sidebar({ serverUser }: { serverUser: ServerUser }) {
  const pathname = usePathname();

  const displayName = serverUser?.name ?? serverUser?.username ?? "Guest";
  const roleLabel = serverUser?.role_label ?? "ผู้ใช้";
  const roleKey = (serverUser?.role_key ?? "department_user").toLowerCase();

  const roleHome = useMemo(() => {
    const t = pickHomeByRole(roleKey);
    return t && t !== "/login" ? t : null;
  }, [roleKey]);


  const visibleItems = useMemo(() => {
    // Admin: เมนูเฉพาะสำหรับผู้ดูแลระบบ
    if (roleKey === "admin") {
      return [
        { id: "dashboard", href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { id: "manage-org", href: "/admin/manage-org", icon: Building2, label: "จัดการองค์กร" },
        { id: "manage-user", href: "/admin/manage-user", icon: Users, label: "จัดการผู้ใช้" },
        { id: "settings", href: "/admin/settings", icon: Settings, label: "ตั้งค่า" },
      ];
    }

    // HR: dashboard (ถ้ามี) + department + setup
    if (roleKey === "hr") {
      return (
        [
          roleHome
            ? {
                id: "dashboard",
                href: roleHome,
                icon: LayoutDashboard,
                label: "ภาพรวม",
              }
            : null,
          {
            id: "department",
            href: "/organizer/department",
            icon: Building2,
            label: "หน่วยงาน",
          },
           {
            id: "users",
            href: "/organizer/users",
            icon: Users,
            label: "พนักงาน",
          },
          { id: "setup", href: "/organizer/setup", icon: Settings, label: "ตั้งค่า" },
        ].filter(Boolean) as Array<{ id: string; href: string; icon: any; label: string }>
      );
    }

    return (
      [
        roleHome
          ? {
              id: "dashboard",
              href: roleHome,
              icon: LayoutDashboard,
              label: "ภาพรวม",
            }
          : null,
        {
          id: "projects",
          href: "/organizer/projects/my-project",
          icon: ClipboardList,
          label: "โครงการ",
        },
        { id: "reports", href: "/organizer/reports", icon: TrendingUp, label: "รายงาน" },
        { id: "setup", href: "/organizer/setup", icon: Settings, label: "ตั้งค่า" },
      ].filter(Boolean) as Array<{ id: string; href: string; icon: any; label: string }>
    );
  }, [roleKey, roleHome]);

  const initials = (displayName || "U").slice(0, 2).toUpperCase();

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
      <div className="flex items-center gap-3 px-4 py-4 min-h-[73px]">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-white">
          <span className="text-sm font-semibold">{initials}</span>
        </div>
        <div className="overflow-hidden opacity-0 transition-all duration-300 group-hover:opacity-100 whitespace-nowrap">
          <div className="text-sm font-semibold text-gray-900">{displayName}</div>
          <div className="text-xs text-gray-500">{roleLabel}</div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-4">
        <div className="space-y-1">
          {visibleItems.map(({ id, href, icon: Icon, label }) => {
            const nh = normalizePath(href);
            const np = normalizePath(pathname || "");
            const active = np === nh || np.startsWith(nh + "/");

            return (
              <Link
                key={id}
                href={href}
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

      <div className="px-2 py-3">
        {/* <form action="/api/auth/logout" method="post">
          <button
            type="submit"
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
        </form> */}
      </div>
    </aside>
  );
}
