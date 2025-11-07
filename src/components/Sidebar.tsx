// Sidebar.tsx
"use client"

import React, { useCallback, useEffect, useMemo, useState, useRef } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Building2,
  Settings,
  TrendingUp,
  ClipboardList,
  LogOut,
  Menu,
  X,
} from "lucide-react"

function getCookie(name: string) {
  if (typeof document === "undefined") return null
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()!.split(";").shift() || null
  return null
}

const normalizePath = (p: string) => {
  if (!p) return ""
  try {
    const base = typeof window !== "undefined" ? window.location.origin : "http://localhost"
    const url = new URL(p, base)
    return url.pathname.replace(/\/+$/g, "")
  } catch {
    return p.replace(/[#?].*$/, "").replace(/\/+$/g, "")
  }
}

export function Sidebar() {
  const nextPathname = usePathname()
  const router = useRouter()

  const [clientPath, setClientPath] = useState<string>("")
  const [username, setUsername] = useState<string | null>(null)
  const [role, setRole] = useState<string | null>(null)
  const [expanded, setExpanded] = useState(false)
  
  // State สำหรับ mobile/tablet sidebar
  const [mobileOpen, setMobileOpen] = useState(false)
  
  // Refs สำหรับ swipe gesture
  const touchStartX = useRef<number>(0)
  const touchCurrentX = useRef<number>(0)
  const sidebarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setClientPath(normalizePath(window.location.pathname || ""))

    const onPop = () => setClientPath(normalizePath(window.location.pathname))
    window.addEventListener("popstate", onPop)
    return () => window.removeEventListener("popstate", onPop)
  }, [])

  useEffect(() => {
    if (nextPathname) {
      setClientPath(normalizePath(nextPathname))
    }
  }, [nextPathname])

  useEffect(() => {
    setUsername(getCookie("mock_uid"))
    setRole(getCookie("mock_role"))
  }, [])

  // Handle swipe gestures
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      // ตรวจสอบว่าเริ่ม swipe จากขอบซ้าย (0-30px) หรือจาก sidebar
      const touch = e.touches[0]
      const isFromEdge = touch.clientX < 30
      const isFromSidebar = sidebarRef.current?.contains(e.target as Node)
      
      if (isFromEdge || isFromSidebar) {
        touchStartX.current = touch.clientX
        touchCurrentX.current = touch.clientX
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (touchStartX.current === 0) return
      
      const touch = e.touches[0]
      touchCurrentX.current = touch.clientX
      const diff = touch.clientX - touchStartX.current

      // ถ้า swipe จากซ้ายไปขวา มากกว่า 50px ให้เปิด
      if (!mobileOpen && diff > 50) {
        setMobileOpen(true)
        touchStartX.current = 0
      }
      // ถ้า swipe จากขวาไปซ้าย มากกว่า 50px ให้ปิด
      else if (mobileOpen && diff < -50) {
        setMobileOpen(false)
        touchStartX.current = 0
      }
    }

    const handleTouchEnd = () => {
      touchStartX.current = 0
      touchCurrentX.current = 0
    }

    document.addEventListener("touchstart", handleTouchStart, { passive: true })
    document.addEventListener("touchmove", handleTouchMove, { passive: true })
    document.addEventListener("touchend", handleTouchEnd)

    return () => {
      document.removeEventListener("touchstart", handleTouchStart)
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleTouchEnd)
    }
  }, [mobileOpen])

  // ล็อค scroll เมื่อ sidebar เปิดบน mobile
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileOpen])

  const items = useMemo(
    () => [
      { href: "/user/dashboard", icon: LayoutDashboard, label: "ภาพรวม" },
      { href: "/user/projects/my-project", icon: ClipboardList, label: "โครงการ" },
      { href: "/user/department", icon: Building2, label: "หน่วยงาน" },
      { href: "/user/reports", icon: TrendingUp, label: "รายงาน" },
      { href: "/user/setup", icon: Settings, label: "ตั้งค่า" },
    ],
    [],
  )

  function clearCookie(name: string) {
    if (typeof document === "undefined") return
    document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`
  }

  function handleLogout() {
    clearCookie("mock_uid")
    clearCookie("mock_role")
    setMobileOpen(false)
    router.replace("/login")
  }

  const handleLinkClick = useCallback(
    (href: string, e: React.MouseEvent<HTMLAnchorElement>) => {
      const nh = normalizePath(href)
      if (clientPath === nh) {
        router.replace(href)
      }
      // ปิด sidebar บน mobile หลังคลิก
      setMobileOpen(false)
    },
    [clientPath, router],
  )

  const initials = (username ?? "U").slice(0, 2).toUpperCase()
  const roleLabel =
    role === "head"
      ? "หัวหน้า"
      : role === "planning"
      ? "แผนงาน"
      : role === "director"
      ? "ผู้อำนวยการ"
      : role === "admin"
      ? "ผู้ดูแลระบบ"
      : "ผู้ใช้"

  return (
    <>
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-md md:hidden"
        aria-label="เปิด/ปิดเมนู"
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}
      <aside
        ref={sidebarRef}
        className={`
          group fixed left-0 top-0 z-40 flex h-screen flex-col
          bg-white shadow-sm transition-all duration-300 ease-in-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          w-64
          md:translate-x-0 md:w-16 md:hover:w-64
        `}
        aria-label="Sidebar"
      >
        <div className="flex items-center gap-3 px-4 py-4 min-h-[73px]">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-md">
            <span className="text-sm font-semibold">{initials}</span>
          </div>
          <div className="overflow-hidden whitespace-nowrap opacity-100 transition-all duration-300 md:opacity-0 md:group-hover:opacity-100">
            <div className="text-sm font-semibold text-gray-900">{username || "Guest"}</div>
            <div className="text-xs text-gray-500">{roleLabel}</div>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto px-2 py-4">
          <div className="space-y-1">
            {items.map(({ href, icon: Icon, label }) => {
              const nh = normalizePath(href)
              const np = clientPath
              const active = np === nh || np.startsWith(nh + "/")

              return (
                <Link
                  key={href}
                  href={href}
                  onClick={(e) => handleLinkClick(href, e)}
                  aria-current={active ? "page" : undefined}
                  className={`group/item flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200 ${
                    active ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                  title={label}
                >
                  <Icon className={`h-5 w-5 flex-shrink-0 ${active ? "text-blue-600" : ""}`} />
         
                  <span className="overflow-hidden whitespace-nowrap opacity-100 transition-all duration-300 md:opacity-0 md:group-hover:opacity-100">
                    {label}
                  </span>
                </Link>
              )
            })}
          </div>
        </nav>
        <div className="px-2 py-3">
          <button
            onClick={handleLogout}
            className="
              flex w-full items-center gap-3 rounded-lg px-3 py-2.5
              text-red-600 transition-all duration-200
              hover:bg-red-50 hover:text-red-700
            "
            title="ออกจากระบบ"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            <span className="overflow-hidden whitespace-nowrap opacity-100 transition-all duration-300 md:opacity-0 md:group-hover:opacity-100">
              ออกจากระบบ
            </span>
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar