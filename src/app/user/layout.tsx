import type { Metadata } from "next"
import { Sidebar } from "@/components/Sidebar"

export const metadata: Metadata = { title: "E-Budget" }

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-white [--app-header-h:64px]">
      <Sidebar />
      <main className="container mx-auto px-4 pt-[var(--app-header-h)] py-6">
        {children}
      </main>
    </div>
  )
}
