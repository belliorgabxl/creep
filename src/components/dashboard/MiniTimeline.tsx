"use client"

import { Calendar, FileText, CheckCircle, XCircle } from "lucide-react"

export function MiniTimeline() {
  const milestones = [
    {
      date: "15 ม.ค. 68",
      title: "ปิดรับข้อเสนอโครงการ Q1",
      icon: Calendar,
      color: "text-red-600 bg-red-100",
    },
    {
      date: "22 ม.ค. 68",
      title: "ประชุมพิจารณาอนุมัติ",
      icon: FileText,
      color: "text-amber-600 bg-amber-100",
    },
    {
      date: "30 ม.ค. 68",
      title: "ประกาศผลอนุมัติ Q1",
      icon: CheckCircle,
      color: "text-green-600 bg-green-100",
    },
    {
      date: "15 มี.ค. 68",
      title: "ปิดโครงการ Q4/67",
      icon: XCircle,
      color: "text-blue-600 bg-blue-100",
    },
  ]
  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 px-4 py-3">
        <h3 className="text-base font-semibold text-gray-800">
          กำหนดการสำคัญไตรมาสนี้
        </h3>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {milestones.map((m, i) => {
            const Icon = m.icon
            return (
              <div
                key={i}
                className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 transition-colors hover:bg-gray-100"
              >
                <div className={`rounded-lg p-2 ${m.color}`}>
                  <Icon className="h-4 w-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="mb-1 text-xs font-medium text-gray-500">
                    {m.date}
                  </p>
                  <p className="text-sm font-medium leading-tight text-gray-800">
                    {m.title}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
