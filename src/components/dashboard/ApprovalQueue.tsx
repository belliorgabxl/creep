"use client"

import { Eye, Clock } from "lucide-react"

interface ApprovalQueueProps {
  filters: Record<string, string>
  approvals: Array<{
    project: string; dept: string; amount: string; owner: string;
    stage: string; lastUpdate: string; priority: "high" | "medium" | "low"
  }>
}

export function ApprovalQueue({ approvals }: ApprovalQueueProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <div>
          <h3 className="text-base font-semibold text-gray-900">คิวงานที่ต้องอนุมัติของฉัน</h3>
          <p className="mt-1 text-xs text-gray-500 ">รายการรออนุมัติ {approvals.length} รายการ</p>
        </div>
        <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 ">
          {approvals.length} รายการ
        </span>
      </div>

      <div className="space-y-3 p-4">
        {approvals.map((item, index) => (
          <div
            key={index}
            className="relative flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-colors hover:bg-gray-50"
          >
            <div
              className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${
                item.priority === "high"
                  ? "bg-red-600"
                  : item.priority === "medium"
                  ? "bg-amber-500"
                  : "bg-gray-300 "
              }`}
            />
            <div className="flex flex-col justify-between gap-3 pl-3 sm:flex-row sm:items-start">
              <div className="min-w-0 flex-1 space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-semibold leading-tight text-gray-900 transition-colors hover:text-blue-600">
                    {item.project}
                  </h4>
                  <span className="shrink-0 rounded-md border border-gray-200 px-2 py-0.5 text-xs font-medium text-gray-700">
                    {item.dept}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
                  <span className="text-sm font-bold text-blue-600">{item.amount}</span>
                  <span className="text-gray-500">
                    โดย <span className="font-medium text-gray-900">{item.owner}</span>
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-700">
                    {item.stage}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Clock className="h-3.5 w-3.5" />
                    <span>อัปเดต {item.lastUpdate}</span>
                  </div>
                </div>
              </div>

              <button className="inline-flex items-center gap-2 rounded-md bg-gray-700 px-3 py-2 text-xs font-medium text-white shadow-sm hover:bg-gray-800">
                <Eye className="h-4 w-4" />
                ตรวจสอบ
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
