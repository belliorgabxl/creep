"use client"

import React, { useEffect, useState } from "react"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts"

interface ChartsSectionProps {
  filters: Record<string, string>
  onFilterChange: (key: string, value: string) => void
  dataBudgetByDept: Array<{ dept: string; approved: number; pending: number; rejected: number }>
  dataProjectTypes: Array<{ name: string; value: number }>
}

const HEX = {
  white: "#ffffff",
  g50: "#f9fafb",
  g100: "#f3f4f6",
  g200: "#e5e7eb",
  g400: "#9ca3af",
  blue600: "#2563eb",
  green600: "#16a34a",
  amber500: "#f59e0b",
  red600: "#dc2626",
  indigo600: "#4f46e5",
}
const PIE = [HEX.blue600, HEX.indigo600]

function useIsMobile(maxWidth = 640) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia(`(max-width:${maxWidth}px)`)
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])

  return isMobile
}

export function ChartsSection({ dataBudgetByDept, dataProjectTypes }: ChartsSectionProps) {
  const isMobile = useIsMobile()

  // ✅ ลดขนาด chart บนมือถือ
  const barHeight = isMobile ? 160 : 300
  const pieHeight = isMobile ? 160 : 300
  const pieRadius = isMobile ? 65 : 95
  const barSize = isMobile ? 12 : 18
  const axisFont = isMobile ? 10 : 12

  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">

      {/* ✅ BAR CHART CARD */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md">
        {/* Header เล็กลง */}
        <div className="border-b border-gray-200 px-3 py-2 sm:px-4 sm:py-3">
          <h3 className="text-sm sm:text-base font-semibold text-gray-900">โครงงานตามหน่วยงาน</h3>
          <p className="mt-0.5 text-[11px] sm:text-xs text-gray-500">แยกตามสถานะการอนุมัติ</p>
        </div>

        <div className="p-3 sm:p-4">
          <ResponsiveContainer width="100%" height={barHeight}>
            <BarChart
              data={dataBudgetByDept}
              barGap={2}
              barCategoryGap={isMobile ? 6 : 12}
              margin={{ top: 8, right: 8, left: 0, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={HEX.g200} opacity={0.5} />

              <XAxis
                dataKey="dept"
                tick={{ fill: HEX.g400, fontSize: axisFont }}
                tickLine={false}
                axisLine={{ stroke: HEX.g200 }}
                interval={isMobile ? "preserveStartEnd" : 0}
                tickFormatter={(v: string) => (isMobile && v.length > 6 ? v.slice(0, 6) + "…" : v)}
              />

              <YAxis
                tick={{ fill: HEX.g400, fontSize: axisFont }}
                tickLine={false}
                axisLine={{ stroke: HEX.g200 }}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: HEX.white,
                  border: `1px solid ${HEX.g200}`,
                  borderRadius: 8,
                  padding: isMobile ? 6 : 10,
                }}
                cursor={{ fill: HEX.g100, opacity: 0.5 }}
              />

              <Legend wrapperStyle={{ fontSize: isMobile ? 10 : 12, paddingTop: 10 }} iconType="circle" />

              <Bar dataKey="approved" stackId="a" fill={HEX.green600} name="อนุมัติ" barSize={barSize} />
              <Bar dataKey="pending" stackId="a" fill={HEX.amber500} name="รออนุมัติ" barSize={barSize} />
              <Bar dataKey="rejected" stackId="a" fill={HEX.red600} name="ไม่อนุมัติ" radius={[4, 4, 0, 0]} barSize={barSize} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ✅ PIE CHART CARD */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md">

        {/* Header */}
        <div className="border-b border-gray-200 px-3 py-2 sm:px-4 sm:py-3">
          <h3 className="text-sm sm:text-base font-semibold text-gray-900">ประเภทแผนงาน</h3>
          <p className="mt-0.5 text-[11px] sm:text-xs text-gray-500">สัดส่วนงานประจำและโครงการ</p>
        </div>

        <div className="p-3 sm:p-4">
          <ResponsiveContainer width="100%" height={pieHeight}>
            <PieChart>
              <Pie
                data={dataProjectTypes}
                cx="50%"
                cy={isMobile ? "50%" : "45%"}
                outerRadius={pieRadius}
                dataKey="value"
                strokeWidth={2}
                stroke={HEX.white}
                label={isMobile ? false : ({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={!isMobile}
              >
                {dataProjectTypes.map((_, i) => (
                  <Cell key={i} fill={PIE[i % PIE.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: HEX.white,
                  border: `1px solid ${HEX.g200}`,
                  borderRadius: 8,
                  padding: isMobile ? 6 : 10,
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* legend */}
          <div className="mt-4 sm:mt-6 flex flex-wrap justify-center gap-4 sm:gap-8">
            {dataProjectTypes.map((type, i) => (
              <div key={i} className="flex items-center gap-2">
                <div
                  className="h-3 w-3 sm:h-3.5 sm:w-3.5 rounded-full shadow-sm"
                  style={{ backgroundColor: PIE[i % PIE.length] }}
                />
                <div className="flex flex-col">
                  <span className="text-xs sm:text-sm font-medium text-gray-900">{type.name}</span>
                  <span className="text-[11px] sm:text-xs text-gray-500">{type.value} โครงการ</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
