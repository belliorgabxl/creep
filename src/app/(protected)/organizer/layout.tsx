import type { Metadata } from "next"
import { Sidebar } from "@/components/Sidebar"
import { TopBar } from "@/components/TopBar"

export const metadata: Metadata = { title: "E-Budget" }

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-white [--app-header-h:64px]">
      {/* Mobile */}
      <div className="md:hidden">
        <TopBar />
      </div>

      {/* Desktop */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      <main className="pt-[var(--app-header-h)] md:pl-16 px-4 py-6">
        {children}
      </main>
    </div>
  )
}
