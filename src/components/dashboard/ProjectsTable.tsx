"use client"

import { useState } from "react"
import { Eye, Edit, FileX, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

interface ProjectsTableProps {
  filters: Record<string, string>
  projects: Array<{
    name: string
    dept: string
    type: string
    amount: string
    status: "approved" | "pending" | "rejected" | "closed"
    qaCount: number
    strategy: string
    period: string
  }>
}

export function ProjectsTable({ projects }: ProjectsTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const variants: Record<
    string,
    { label: string; className: string }
  > = {
    approved: {
      label: "อนุมัติ",
      className: "border-green-500/20 bg-green-500/10 text-green-700",
    },
    pending: {
      label: "รออนุมัติ",
      className: "border-amber-500/20 bg-amber-500/10 text-amber-700",
    },
    rejected: {
      label: "ไม่อนุมัติ",
      className: "border-red-600/20 bg-red-600/10 text-red-700",
    },
    closed: {
      label: "ปิดแล้ว",
      className: "border-gray-200 bg-gray-100 text-gray-600",
    },
  }

  const getStatusBadge = (status: keyof typeof variants) => {
    const v = variants[status]
    return (
      <span
        className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${v.className}`}
      >
        {v.label}
      </span>
    )
  }

  const totalPages = Math.ceil(projects.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProjects = projects.slice(startIndex, endIndex)

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
  <div>
    <h3 className="text-base font-semibold text-gray-900">
      รายการโครงการทั้งหมด
    </h3>
    <p className="mt-1 text-xs text-gray-500">จัดการและติดตามโครงการ</p>
  </div>

  <div className="flex items-center gap-2">
    <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
      {projects.length} โครงการ
    </span>
    <Link
      href="/user/projects"
    className="text-xs text-gray-600  hover:text-indigo-700 hover:underline"   >
      ทั้งหมด
    </Link>
  </div>
</div>

      <div className="p-4">
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-gray-900">
                {[
                  "ชื่อโครงการ",
                  "หน่วยงาน",
                  "ประเภท",
                  "งบประมาณ",
                  "สถานะ",
                  "QA",
                  "ยุทธศาสตร์",
                  "ระยะเวลา",
                  "จัดการ",
                ].map((h, i) => (
                  <th
                    key={i}
                    className={`px-4 py-3 font-semibold ${
                      h === "งบประมาณ"
                        ? "text-right"
                        : h === "QA" || h === "จัดการ"
                        ? "text-center"
                        : ""
                    }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentProjects.map((p, i) => (
                <tr
                  key={i}
                  className="border-t border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {p.name}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-md border border-gray-200 px-2 py-0.5 text-xs font-medium text-gray-700">
                      {p.dept}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{p.type}</td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-700">
                    {p.amount}
                  </td>
                  <td className="px-4 py-3">{getStatusBadge(p.status)}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center rounded-md border border-blue-600/20 bg-blue-600/10 px-2 py-0.5 text-xs font-medium text-blue-700">
                      {p.qaCount}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-md border border-gray-200 px-2 py-0.5 text-xs font-medium text-gray-700">
                      {p.strategy}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{p.period}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button className="h-8 w-8 rounded-md hover:bg-blue-600/10 hover:text-blue-700">
                        <Eye className="mx-auto h-4 w-4" />
                      </button>
                      <button className="h-8 w-8 rounded-md hover:bg-blue-600/10 hover:text-blue-700">
                        <Edit className="mx-auto h-4 w-4" />
                      </button>
                      <button className="h-8 w-8 rounded-md hover:bg-red-600/10 hover:text-red-700">
                        <FileX className="mx-auto h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm font-medium text-gray-600">
            แสดง {startIndex + 1}-{Math.min(endIndex, projects.length)} จาก{" "}
            {projects.length} รายการ
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
              ก่อนหน้า
            </button>
            <span className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700">
              หน้า {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm hover:bg-gray-50 disabled:opacity-50"
            >
              ถัดไป
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
