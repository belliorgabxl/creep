"use client"

import { useState } from "react"
import { Menu, X, LogOut } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function TopBar() {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  function clearCookie(name: string) {
    if (typeof document === "undefined") return
    document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`
  }

  const handleLogout = () => {
    clearCookie("mock_uid")
    clearCookie("mock_role")
    router.replace("/login")
  }

  return (
    <header className="fixed top-0 left-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 h-14">
        <span className="text-base font-semibold text-gray-800">E-Budget</span>
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="p-2 rounded-md hover:bg-gray-100 transition"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {menuOpen && (
        <div className="absolute top-14 right-0 w-full bg-white shadow-md border-t border-gray-100 animate-slideDown">
          <nav className="flex flex-col py-2 text-center">
            {[
              { href: "/user/dashboard", label: "ภาพรวม" },
              { href: "/user/projects/my-project", label: "โครงการ" },
              { href: "/user/department", label: "หน่วยงาน" },
              { href: "/user/reports", label: "รายงาน" },
              { href: "/user/setup", label: "ตั้งค่า" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-3 text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="text-center px-4 py-3 text-red-600 hover:bg-red-50 active:bg-red-100"
            >
              ออกจากระบบ
            </button>
          </nav>
        </div>
      )}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </header>
  )
}

export default TopBar
