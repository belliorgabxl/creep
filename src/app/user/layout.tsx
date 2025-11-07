"use client"
import { Sidebar } from "@/components/Sidebar"
import { TopBar } from "@/components/TopBar"
import { useEffect, useState } from "react"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkSize = () => setIsMobile(window.innerWidth < 768)
    checkSize()
    window.addEventListener("resize", checkSize)
    return () => window.removeEventListener("resize", checkSize)
  }, [])

  return (
    <div className="min-h-dvh bg-white">
      {isMobile ? <TopBar /> : <Sidebar />}
      <main className={`${isMobile ? "pt-14" : "md:pl-16"} px-4 py-6`}>
        {children}
      </main>
    </div>
  )
}
