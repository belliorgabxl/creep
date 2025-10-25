"use client"

import { X } from "lucide-react"

interface FilterBarProps {
  filters: Record<string, string>
  activeFilters: string[]
  onFilterChange: (key: string, value: string) => void
  onClearAll: () => void
}

export function FilterBar({ filters, activeFilters, onFilterChange, onClearAll }: FilterBarProps) {
  if (activeFilters.length === 0) return null

  const filterLabels: Record<string, string> = {
    department: "หน่วยงาน",
    projectType: "ประเภท",
    status: "สถานะ",
    qaIndicator: "ตัวบ่งชี้ QA",
    strategy: "ยุทธศาสตร์",
  }

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-gray-200 bg-white p-3">
      <span className="text-sm text-gray-500">ตัวกรอง:</span>

      {activeFilters.map((key) => (
        <span
          key={key}
          className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs text-gray-700"
        >
          {filterLabels[key]}: {filters[key]}
          <button
            onClick={() => onFilterChange(key, "all")}
            className="ml-1 rounded-full p-0.5 hover:bg-gray-200"
            aria-label="clear filter"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}

      <button
        onClick={onClearAll}
        className="ml-auto rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-xs text-gray-700 hover:bg-gray-100"
      >
        ล้างทั้งหมด
      </button>
    </div>
  )
}
