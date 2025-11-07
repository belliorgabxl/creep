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

// hook เล็กๆ ไว้ตรวจ breakpoint
function useIsMobile(maxWidth = 640) {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia(`(max-width:${maxWidth}px)`)
    const onChange = () => setIsMobile(mq.matches)
    onChange()
    mq.addEventListener?.("change", onChange)
    return () => mq.removeEventListener?.("change", onChange)
  }, [maxWidth])
  return isMobile
}

export function ChartsSection({ dataBudgetByDept, dataProjectTypes }: ChartsSectionProps) {
  const isMobile = useIsMobile()
  const barHeight = isMobile ? 200 : 300
  const pieHeight = isMobile ? 200 : 300
  const axisFont = isMobile ? 10 : 11
  const legendFont = isMobile ? 11 : 12
  const barSize = isMobile ? 14 : 18
  const categoryGap = isMobile ? 8 : 12
  const pieOuterRadius = isMobile ? 75 : 95

  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
      {/* Bar */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md p-3 sm:p-4">
        <div className="border-b border-gray-200 px-3 py-2.5 sm:px-4 sm:py-3">
          <h3 className="text-sm sm:text-base font-semibold text-gray-900">โครงงานตามหน่วยงาน</h3>
          <p className="mt-0.5 sm:mt-1 text-[11px] sm:text-xs text-gray-500">แยกตามสถานะการอนุมัติ</p>
        </div>
        <div className="p-3 sm:p-4">
          <ResponsiveContainer width="100%" height={barHeight}>
            <BarChart
              data={dataBudgetByDept}
              barGap={2}
              barCategoryGap={categoryGap}
              margin={{ top: 8, right: isMobile ? 8 : 16, left: isMobile ? 0 : 8, bottom: isMobile ? 8 : 12 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={HEX.g200} opacity={0.5} />
              <XAxis
                dataKey="dept"
                tick={{ fill: HEX.g400, fontSize: axisFont }}
                tickLine={false}
                axisLine={{ stroke: HEX.g200 }}
                // ลดจำนวน label บนมือถือให้ไม่ชนกัน
                interval={isMobile ? "preserveStartEnd" : 0}
                // ถ้าชื่อยาว ให้ตัดสั้นบนมือถือ
                tickFormatter={(v: string) => (isMobile && v.length > 8 ? v.slice(0, 8) + "…" : v)}
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
                  padding: isMobile ? 8 : 12,
                }}
                cursor={{ fill: HEX.g100, opacity: 0.5 }}
              />
              <Legend
                wrapperStyle={{ fontSize: legendFont, paddingTop: isMobile ? 8 : 16 }}
                iconType="circle"
              />
              <Bar dataKey="approved" stackId="a" fill={HEX.green600} name="อนุมัติ" barSize={barSize} />
              <Bar dataKey="pending" stackId="a" fill={HEX.amber500} name="รออนุมัติ" barSize={barSize} />
              <Bar dataKey="rejected" stackId="a" fill={HEX.red600} name="ไม่อนุมัติ" radius={[4, 4, 0, 0]} barSize={barSize} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
        <div className="border-b border-gray-200 px-3 py-2.5 sm:px-4 sm:py-3">
          <h3 className="text-sm sm:text-base font-semibold text-gray-900">ประเภทแผนงาน</h3>
          <p className="mt-0.5 sm:mt-1 text-[11px] sm:text-xs text-gray-500">สัดส่วนงานประจำและโครงการ</p>
        </div>
        <div className="p-3 sm:p-4">
          <ResponsiveContainer width="100%" height={pieHeight}>
            <PieChart margin={{ top: isMobile ? 0 : 8, right: 0, bottom: 0, left: 0 }}>
              <Pie
                data={dataProjectTypes}
                cx="50%"
                cy={isMobile ? "50%" : "45%"}
                outerRadius={pieOuterRadius}
                dataKey="value"
                strokeWidth={2}
                stroke={HEX.white}
                // มือถือซ่อน label กันล้น; จอใหญ่แสดง %
                label={
                  isMobile
                    ? false
                    : ({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`
                }
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
                  padding: isMobile ? 8 : 12,
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* legend แบบ custom ขนาดเล็กบนมือถือ */}
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
