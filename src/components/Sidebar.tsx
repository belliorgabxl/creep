"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Settings,
  TrendingUp,
  ClipboardList,
  LogOut,
  User2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()!.split(";").shift() || null;
  return null;
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

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

  function clearCookie(name: string) {
    document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
  }

  function handleLogout() {
    clearCookie("mock_uid");
    clearCookie("mock_role");
    router.replace("/login");
  }

  const initials = (username ?? "U").slice(0, 2).toUpperCase();
  const roleLabel =
    role === "head"
      ? "Head"
      : role === "planning"
      ? "Planning"
      : role === "director"
      ? "Director"
      : role === "admin"
      ? "Admin"
      : "user";

  return (
    <aside
      className="
        fixed left-0 top-0 z-40 h-[100dvh]
        md:block hidden
        group
      "
      aria-label="Sidebar"
    >
      {/* --- RAIL หลัก: กว้างคงที่ w-16 โชว์เฉพาะไอคอน --- */}
      <div
        className="
          h-full w-16 border-r border-gray-200 bg-gray-50 text-gray-800
          flex flex-col
        "
      >
        <div className="border-b border-gray-200 p-3">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-gray-700 text-white mx-auto">
            <span className="text-xs font-semibold">{initials}</span>
          </div>
        </div>

        <nav className="p-2 space-y-1 flex-1 overflow-y-auto">
          {items.map(({ href, icon: Icon, label }) => {
            const active = pathname.startsWith(href);
            const isHover = hovered === href;

            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                onMouseEnter={() => setHovered(href)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(href)} // รองรับคีย์บอร์ด
                onBlur={() => setHovered(null)}
                className={[
                  "flex items-center justify-center rounded-lg py-2 text-sm transition-colors",
                  active || isHover
                    ? "bg-gray-200 text-gray-900"
                    : "hover:bg-gray-100 hover:text-gray-900",
                ].join(" ")}
                title={label}
              >
                <Icon className="h-5 w-5 shrink-0" />
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-gray-200 p-2">
          <button
            onClick={handleLogout}
            className="
              w-full inline-flex items-center justify-center
              rounded-lg py-2 text-sm
              text-red-700 hover:text-red-800 hover:bg-red-50
              transition-colors
            "
            title="ออกจากระบบ"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div
        className="
          pointer-events-none
          absolute left-16 top-0 h-full w-56
          opacity-0 -translate-x-2
          motion-safe:transition-all duration-200 ease-out
          group-hover:opacity-100 group-hover:translate-x-0 group-hover:pointer-events-auto
        "
      >
        <div className="h-full -translate-x-1  bg-gray-50 ">
          <div className="border-b border-gray-200 px-1 py-[13px]">
            <div className="flex items-center gap-3">
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {username || "Guest"}
                </div>
                <div className="text-xs text-gray-600 -mt-0.5">{roleLabel}</div>
              </div>
            </div>
          </div>

          <nav className="p-2 space-y-1 flex-1 overflow-y-auto">
            {items.map(({ href, label }) => {
              const active = pathname.startsWith(href);
              const isHover = hovered === href;

              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  onMouseEnter={() => setHovered(href)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(href)}
                  onBlur={() => setHovered(null)}
                  className={[
                    "flex items-center rounded-lg py-2 text-sm transition-colors px-3",
                    active || isHover
                      ? "text-indigo-600"
                      : "hover:bg-gray-100 hover:text-gray-900",
                  ].join(" ")}
                >
                  <span className="truncate">{label}</span>
                </Link>
              );
            })}
          </nav>
          
        </div>
      </div>
    </aside>
  );
}
