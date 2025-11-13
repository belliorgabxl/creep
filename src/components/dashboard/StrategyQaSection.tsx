"use client"

import Link from "next/link"
import { Target } from "lucide-react"

interface StrategyQaSectionProps {
  strategies: Array<{ id: string; name: string; count: number }>
  qaIndicators: Array<{ id: string; name: string; count: number }>
  onFilterChange?: (key: string, value: string) => void
}

export function StrategyQaSection({
  strategies = [],
  qaIndicators = [],
  onFilterChange,
}: StrategyQaSectionProps) {
  return (
    <div className="space-y-6">
      {/* --- Strategic plans section --- */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <h3 className="text-base font-semibold text-gray-900">
            สรุปตามแผนยุทธศาสตร์
          </h3>
        </div>

        <div className="p-4">
          {strategies.length === 0 ? (
            <p className="text-sm text-gray-500">ไม่มีข้อมูลแผนยุทธศาสตร์</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {strategies.map((s) => (
                <button
                  key={s.id}
                  onClick={() => onFilterChange?.("strategy", s.id)}
                  className="inline-flex items-center gap-2 rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-700 shadow-sm transition-colors hover:bg-gray-700 hover:text-white"
                >
                  {s.name}
                  <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
                    {s.count}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* --- QA indicators section --- */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <h3 className="flex items-center gap-2 text-base font-semibold text-gray-900">
            <Target className="h-4 w-4" />
            ความครอบคลุมตัวบ่งชี้ QA
          </h3>
          <Link
            href="/organizer/qa-coverage"
            className="text-xs text-gray-600 hover:text-indigo-700 hover:underline"
          >
            ทั้งหมด
          </Link>
        </div>

        <div className="space-y-3 p-4">
          {qaIndicators.length === 0 ? (
            <p className="text-sm text-gray-500">ไม่มีข้อมูลตัวบ่งชี้ QA</p>
          ) : (
            qaIndicators.map((q) => (
              <button
                key={q.id}
                onClick={() => onFilterChange?.("qaIndicator", q.id)}
                className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3 text-left text-gray-800 transition-colors hover:bg-gray-100"
              >
                <span className="text-sm font-medium">{q.name}</span>
                <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs text-gray-700">
                  {q.count}
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
