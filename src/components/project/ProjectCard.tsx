import { Project } from "@/dto/projectDto"
import Link from "next/link"

export function ProjectCard({ p }: { p: Project }) {
  const kpiCount = p.kpis?.length ?? 0
  const qaCount = p.qaIndicators?.length ?? 0
  const stratCount = p.strategies?.length ?? 0
  const fileCount = p.attachmentsCount ?? 0

  return (
    <Link
      href={`/user/projects/${p.id}`}
      className="group block rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
    >

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 group-hover:text-gray-950 truncate">
            {p.name}
          </h3>
          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-gray-600">
            {p.type && <BadgeTiny>{p.type}</BadgeTiny>}
            {p.department && <BadgeTiny>{p.department}</BadgeTiny>}
            {p.durationMonths ? (
              <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5">
                ระยะเวลา {p.durationMonths} เดือน
              </span>
            ) : null}
          </div>
        </div>
        <StatusBadge status={p.status} />
      </div>

      {p.objective ? (
        <p className="mt-2 line-clamp-2 text-xs text-gray-600">
          {p.objective}
        </p>
      ) : null}

      <div className="mt-3">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>ความคืบหน้า</span>
          <span className="tabular-nums">{(p.progress ?? 0)}%</span>
        </div>
        <div className="mt-1">
          <ProgressBar value={p.progress ?? 0} status={p.status} />
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
        <InfoRow label="KPI">
          {kpiCount > 0 ? `${kpiCount} รายการ` : "—"}
        </InfoRow>
        <InfoRow label="งบประมาณ">
          {p.budget != null ? formatBaht(p.budget) : "—"}
        </InfoRow>
        <InfoRow label="QA Indicators">
          {qaCount > 0 ? chipList(p.qaIndicators!, 2) : "—"}
        </InfoRow>
        <InfoRow label="ยุทธศาสตร์">
          {stratCount > 0 ? chipList(p.strategies!, 2) : "—"}
        </InfoRow>
        <InfoRow label="ไฟล์แนบ">
          {fileCount > 0 ? `${fileCount} ไฟล์` : "—"}
        </InfoRow>
        <InfoRow label="อัปเดตล่าสุด">
          {formatThaiDateTime(p.updatedAt)}
        </InfoRow>
      </div>
    </Link>
  )
}

function StatusBadge({ status }: { status: Project["status"] }) {
  const map: Record<Project["status"], string> = {
    draft: "bg-gray-100 text-gray-700",
    in_progress: "bg-blue-100 text-blue-800",
    on_hold: "bg-amber-100 text-amber-800",
    done: "bg-green-100 text-green-800",
  }
  const label: Record<Project["status"], string> = {
    draft: "ฉบับร่าง",
    in_progress: "กำลังดำเนินการ",
    on_hold: "พักไว้",
    done: "เสร็จสิ้น",
  }
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${map[status]}`}>
      {label[status]}
    </span>
  )
}

function ProgressBar({ value, status }: { value: number; status: Project["status"] }) {
  const v = Math.max(0, Math.min(100, value))
  const color =
    status === "done" ? "bg-green-600"
    : status === "on_hold" ? "bg-amber-600"
    : status === "in_progress" ? "bg-blue-600"
    : "bg-gray-800"
  return (
    <div className="h-2 w-full rounded-full bg-gray-200">
      <div
        className={`h-2 rounded-full transition-[width] ${color}`}
        style={{ width: `${v}%` }}
      />
    </div>
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

function BadgeTiny({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5">
      {children}
    </span>
  )
}

function chipList(list: string[], max = 2) {
  const more = list.length - max
  const shown = list.slice(0, max)
  return (
    <span className="flex items-center gap-1">
      {shown.map((t) => (
        <span key={t} className="inline-flex items-center rounded bg-gray-100 px-1.5 py-0.5">
          {t}
        </span>
      ))}
      {more > 0 && <span className="text-gray-500">+{more}</span>}
    </span>
  )
}

function formatBaht(n: number) {
  return new Intl.NumberFormat("th-TH", { style: "currency", currency: "THB", maximumFractionDigits: 0 }).format(n)
}

function formatThaiDateTime(iso: string) {
  const d = new Date(iso)
  return d.toLocaleString("th-TH", { dateStyle: "medium", timeStyle: "short" })
}
