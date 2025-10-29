import { Department } from "@/dto/projectDto"
import { mockDepartments } from "@/resource/mock-data"
import Link from "next/link"

async function getDepartments(): Promise<Department[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/departments`, {
      cache: "no-store",
      headers: { accept: "application/json" },
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = (await res.json()) as { data?: Department[] } | Department[]
    const list = Array.isArray(data) ? data : data.data ?? []
    return list.length ? list : mockDepartments
  } catch {
    return mockDepartments
  }
}

export default async function DepartmentPage() {
  const departments = await getDepartments()
  const total = departments.length

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">หน่วยงาน</h1>
          <p className="text-sm text-gray-600">มีให้เลือกทั้งหมด <b>{total}</b> หน่วยงาน</p>
        </div>

        <Link
          href="/user/department/new"
          className="inline-flex items-center rounded-lg bg-gray-900 px-3.5 py-2 text-sm font-medium text-white hover:bg-black"
        >
          สร้างหน่วยงาน
        </Link>
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {departments.map((d) => (
          <Link
            key={d.id}
            href={`/user/department/${d.id}`}
            className="group rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-xs text-gray-500">{d.code}</div>
                <h3 className="truncate text-sm font-semibold text-gray-900 group-hover:text-gray-950">
                  {d.name}
                </h3>
                {d.head && (
                  <div className="mt-1 text-xs text-gray-600">
                    หัวหน้าหน่วยงาน: <span className="text-gray-800">{d.head}</span>
                  </div>
                )}
              </div>
              <div className="rounded-md bg-gray-50 px-2 py-1 text-right">
                <div className="text-xs text-gray-500">พนง.</div>
                <div className="text-sm font-semibold tabular-nums text-gray-900">
                  {d.employees ?? "—"}
                </div>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
              <InfoRow label="โปรเจ็ก">
                {d.projectsCount != null ? `${d.projectsCount} งาน` : "—"}
              </InfoRow>
              <InfoRow label="อัปเดตล่าสุด">
                {d.updatedAt ? new Date(d.updatedAt).toLocaleDateString("th-TH") : "—"}
              </InfoRow>
            </div>
          </Link>
        ))}
      </section>
    </main>
  )
}
function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-800">{children}</span>
    </div>
  )
}
