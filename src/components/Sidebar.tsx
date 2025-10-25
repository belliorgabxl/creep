"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Building2,
  Settings,
  TrendingUp,
  ClipboardList,
  LogOut,
  User2,
} from "lucide-react"
import { useEffect, useMemo, useState } from "react"

function getCookie(name: string) {
  if (typeof document === "undefined") return null
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()!.split(";").shift() || null
  return null
}

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [username, setUsername] = useState<string | null>(null)
  const [role, setRole] = useState<string | null>(null)

  useEffect(() => {
    setUsername(getCookie("mock_uid"))
    setRole(getCookie("mock_role"))
  }, [])

  const items = useMemo(
    () => [
      { href: "/user/dashboard", icon: LayoutDashboard, label: "ภาพรวม" },
      { href: "/user/projects", icon: ClipboardList, label: "โครงการ" },
      { href: "/user/department", icon: Building2, label: "หน่วยงาน" },
      { href: "/user/reports", icon: TrendingUp, label: "รายงาน" },
      { href: "/user/admin", icon: Settings, label: "ตั้งค่า" },
    ],
    []
  )

  function clearCookie(name: string) {
    document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`
  }

  function handleLogout() {
    clearCookie("mock_uid")
    clearCookie("mock_role")
    router.replace("/login")
  }

  const initials = useMemo(() => {
    if (!username) return "U"
    return username.slice(0, 2).toUpperCase()
  }, [username])

  const roleLabel = useMemo(() => {
    if (!role) return "user"
    switch (role) {
      case "head":
        return "Head"
      case "planning":
        return "Planning"
      case "director":
        return "Director"
      case "admin":
        return "Admin"
      default:
        return "User"
    }
  }, [role])

  return (
    <aside
      className="
        group fixed left-0 z-40 hidden overflow-hidden
        border-r border-gray-200 bg-gray-50 text-gray-800
        md:block
        w-14 hover:w-72 transition-[width] duration-200 ease-out
        top-0
        h-[100dvh]
      "
      aria-label="Sidebar"
    >
      <div className="flex h-full flex-col">
        <div className="border-b border-gray-200 p-3">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-gray-700 text-white">
              <User2 className="h-4 w-4 group-hover:hidden" />
              <span className="hidden text-xs font-semibold group-hover:block">
                {initials}
              </span>
            </div>
            <div className="hidden group-hover:block">
              <div className="text-sm font-medium text-gray-900">
                {username || "Guest"}
              </div>
              <div className="text-xs text-gray-600 -mt-0.5">{roleLabel}</div>
            </div>
          </div>
        </div>
        <nav className="p-2 flex-1 overflow-y-auto">
          {items.map(({ href, icon: Icon, label }) => {
            const active = pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={[
                  "flex items-center rounded-lg px-3 py-2 text-sm transition-colors",
                  active ? "bg-gray-200 text-gray-900" : "hover:bg-gray-100 hover:text-gray-900",
                ].join(" ")}
                title={label}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="ml-3 hidden truncate group-hover:inline">{label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-gray-200 p-2">
          <button
            onClick={handleLogout}
            className="
              w-full inline-flex items-center gap-2
              rounded-lg px-3 py-2 text-sm
              text-red-700 hover:text-red-800
              hover:bg-red-50 transition-colors
            "
            title="ออกจากระบบ"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden group-hover:inline">ออกจากระบบ</span>
          </button>
        </div>
      </div>
    </aside>
  )
}
