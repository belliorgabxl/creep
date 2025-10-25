"use client"

import type { ComponentType, SVGProps } from "react"
import { TrendingUp, TrendingDown, CheckCircle2, Clock, XCircle, DollarSign, FileCheck, Target } from "lucide-react"

type KpiItem = {
  title: string
  value: string
  subValue: string
  delta: string
  trend: "up" | "down"
  icon: ComponentType<SVGProps<SVGSVGElement>>
  colorText: string
  colorBg: string
  data: number[]
}

export function KpiCards() {
  const kpis: KpiItem[] = [
    {
      title: "งบประมาณที่อนุมัติ",
      value: "245",
      subValue: "฿125.4M",
      delta: "+12.5%",
      trend: "up",
      icon: CheckCircle2,
      colorText: "text-green-600",
      colorBg: "bg-green-600/10",
      data: [120, 122, 123, 124, 125, 126, 125],
    },
    {
      title: "รออนุมัติ",
      value: "38",
      subValue: "฿18.2M",
      delta: "-5.2%",
      trend: "down",
      icon: Clock,
      colorText: "text-amber-600",
      colorBg: "bg-amber-500/10",
      data: [20, 25, 22, 28, 24, 23, 21],
    },
    {
      title: "ไม่อนุมัติ/แก้ไข",
      value: "12",
      subValue: "฿3.8M",
      delta: "+2.1%",
      trend: "up",
      icon: XCircle,
      colorText: "text-red-600",
      colorBg: "bg-red-600/10",
      data: [2, 3, 5, 4, 4, 6, 5],
    },
    {
      title: "งบประมาณใช้ไป",
      value: "68%",
      subValue: "฿85.3M / ฿125.4M",
      delta: "+8.3%",
      trend: "up",
      icon: DollarSign,
      colorText: "text-blue-600",
      colorBg: "bg-blue-600/10",
      data: [60, 61, 62, 63, 65, 67, 68],
    },
    {
      title: "โครงการปิด (YTD)",
      value: "187",
      subValue: "76% ของทั้งหมด",
      delta: "+15.8%",
      trend: "up",
      icon: FileCheck,
      colorText: "text-indigo-600",
      colorBg: "bg-indigo-600/10",
      data: [140, 150, 160, 165, 170, 180, 187],
    },
    {
      title: "ความครอบคลุม QA",
      value: "92%",
      subValue: "225/245 โครงการ",
      delta: "+4.2%",
      trend: "up",
      icon: Target,
      colorText: "text-violet-600",
      colorBg: "bg-violet-600/10",
      data: [85, 86, 87, 88, 90, 91, 92],
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
      {kpis.map((kpi, index) => {
        const Icon = kpi.icon
        const TrendIcon = kpi.trend === "up" ? TrendingUp : TrendingDown
        const trendBadge =
          kpi.trend === "up"
            ? "bg-green-500/10 text-green-700"
            : "bg-red-600/10 text-red-700"

        const maxY = Math.max(...kpi.data)
        const minY = Math.min(...kpi.data)
        const normalized = kpi.data.map(
          (v) => 30 - ((v - minY) / (maxY - minY || 1)) * 20
        )
        const step = 100 / (kpi.data.length - 1)
        const points = normalized.map((y, i) => `${i * step},${y}`).join(" ")

        return (
          <div
            key={index}
            className="group h-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex h-full flex-col p-5">
              <div className="mb-4 flex items-start justify-between">
                <div
                  className={`rounded-xl p-2.5 ${kpi.colorBg} ${kpi.colorText} shadow-sm transition-transform group-hover:scale-110`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div
                  className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${trendBadge}`}
                >
                  <TrendIcon className="h-3.5 w-3.5" />
                  <span>{kpi.delta}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <p className="text-3xl font-bold text-gray-900">{kpi.value}</p>
                <p className="text-xs font-medium text-gray-500">
                  {kpi.subValue}
                </p>
                <p className="mt-3 text-xs font-semibold leading-tight text-gray-800">
                  {kpi.title}
                </p>
              </div>

              {/* กราฟเส้น */}
              <div className="mt-4 -mx-1 h-10">
                <svg
                  className={`h-full w-full ${kpi.colorText}`}
                  viewBox="0 0 100 30"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient
                      id={`gradient-${index}`}
                      x1="0%"
                      y1="0%"
                      x2="0%"
                      y2="100%"
                    >
                      <stop
                        offset="0%"
                        stopColor="currentColor"
                        stopOpacity="0.3"
                      />
                      <stop
                        offset="100%"
                        stopColor="currentColor"
                        stopOpacity="0"
                      />
                    </linearGradient>
                  </defs>
                  <path
                    d={`M${points} L100,30 L0,30 Z`}
                    fill={`url(#gradient-${index})`}
                  />
                  <polyline
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    points={points}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
