"use client"

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from "recharts"

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

export function ChartsSection({ dataBudgetByDept, dataProjectTypes }: ChartsSectionProps) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
        <div className="border-b border-gray-200 px-4 py-3">
          <h3 className="text-base font-semibold text-gray-900">งบประมาณตามหน่วยงาน</h3>
          <p className="mt-1 text-xs text-gray-500 ">แยกตามสถานะการอนุมัติ</p>
        </div>
        <div className="p-4">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dataBudgetByDept} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke={HEX.g200} opacity={0.5} />
              <XAxis dataKey="dept" tick={{ fill: HEX.g400, fontSize: 11 }} tickLine={false} axisLine={{ stroke: HEX.g200 }} />
              <YAxis tick={{ fill: HEX.g400, fontSize: 11 }} tickLine={false} axisLine={{ stroke: HEX.g200 }} />
              <Tooltip contentStyle={{ backgroundColor: HEX.white, border: `1px solid ${HEX.g200}`, borderRadius: 8 }} cursor={{ fill: HEX.g100, opacity: 0.5 }} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 16 }} iconType="circle" />
              <Bar dataKey="approved" stackId="a" fill={HEX.green600} name="อนุมัติ" />
              <Bar dataKey="pending"  stackId="a" fill={HEX.amber500} name="รออนุมัติ" />
              <Bar dataKey="rejected" stackId="a" fill={HEX.red600}   name="ไม่อนุมัติ" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md ">
        <div className="border-b border-gray-200 px-4 py-3">
          <h3 className="text-base font-semibold text-gray-900">ประเภทแผนงาน</h3>
          <p className="mt-1 text-xs text-gray-500">สัดส่วนงานประจำและโครงการ</p>
        </div>
        <div className="p-4">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={dataProjectTypes} cx="50%" cy="45%" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={95} dataKey="value" strokeWidth={2} stroke={HEX.white}>
                {dataProjectTypes.map((_, i) => <Cell key={i} fill={PIE[i % PIE.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: HEX.white, border: `1px solid ${HEX.g200}`, borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>

          <div className="mt-6 flex justify-center gap-8">
            {dataProjectTypes.map((type, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <div className="h-3.5 w-3.5 rounded-full shadow-sm" style={{ backgroundColor: PIE[i % PIE.length] }} />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900 ">{type.name}</span>
                  <span className="text-xs text-gray-500">{type.value} โครงการ</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
