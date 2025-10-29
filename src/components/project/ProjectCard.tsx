import { Project } from "@/dto/projectDto";
import Link from "next/link";

export function ProjectCard({ p }: { p: Project }) {
  return (
    <Link
      href={`/user/projects/${p.id}`}
      className="group block rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold text-gray-900 group-hover:text-gray-950">{p.name}</h3>
        <StatusBadge status={p.status} />
      </div>

      <div className="mt-2 text-xs text-gray-600">
        เจ้าของ: <span className="font-medium text-gray-800">{p.owner}</span>
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>ความคืบหน้า</span>
          <span className="tabular-nums">{p.progress}%</span>
        </div>
        <div className="mt-1"><ProgressBar value={p.progress} /></div>
      </div>

      <div className="mt-3 text-[11px] text-gray-500">
        อัปเดตล่าสุด: {new Date(p.updatedAt).toLocaleString()}
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

function ProgressBar({ value }: { value: number }) {
  const v = Math.max(0, Math.min(100, value))
  return (
    <div className="h-2 w-full rounded-full bg-gray-200">
      <div className="h-2 rounded-full bg-gray-800 transition-[width]" style={{ width: `${v}%` }} />
    </div>
  )
}