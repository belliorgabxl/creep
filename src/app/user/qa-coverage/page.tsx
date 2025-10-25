"use client";

import { useMemo, useState } from "react";
import { Search, CheckCircle2, AlertTriangle, Layers3 } from "lucide-react";
import {
  MOCK_QA_COVERAGE,
  MOCK_QA_INDICATORS,
  type QACoverage,
  type QAIndicator,
} from "@/app/mock";

export default function QACoveragePage() {
  const years = ["2566", "2567", "2568", "2569"];
  const [year, setYear] = useState<string>("2568");
  const [query, setQuery] = useState("");

  const filteredCoverage = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base: QACoverage[] = MOCK_QA_COVERAGE;
    if (!q) return base;
    return base.filter(
      (c) =>
        c.code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        String(c.projects).includes(q)
    );
  }, [query]);

  const totals = useMemo(() => {
    const indicatorsTotal = MOCK_QA_INDICATORS.filter((i) => !i.year || String(i.year) === year).length;
    const projectsTotal = filteredCoverage.reduce((sum, c) => sum + (c.projects || 0), 0);
    const gapsTotal = filteredCoverage.filter((c) => c.gaps).length;
    return { indicatorsTotal, projectsTotal, gapsTotal };
  }, [year, filteredCoverage]);

  return (
    <div className="min-h-dvh bg-gray-50">
      <header className="sticky top-0 z-40 w-full border-b border-indigo-100/70 bg-white/90 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-600 text-white shadow">
                QA
              </div>
              <div>
                <h1 className="text-lg font-semibold text-slate-900">
                  ความครอบคลุมตัวบ่งชี้ QA
                </h1>
                <p className="text-xs text-slate-500">
                  ภาพรวมการครอบคลุมตัวบ่งชี้ตามโครงการ และสถานะช่องว่าง
                </p>
              </div>
            </div>
            <div className="inline-flex items-center gap-2">
              <span className="text-sm text-slate-600">ปีงบประมาณ</span>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="rounded-lg border border-indigo-200 bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm focus:border-indigo-400 focus:outline-none"
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            icon={<Layers3 className="h-5 w-5" />}
            title="จำนวนตัวบ่งชี้"
            value={totals.indicatorsTotal.toLocaleString()}
            hint={`ปี ${year}`}
            color="indigo"
          />
          <StatCard
            icon={<CheckCircle2 className="h-5 w-5" />}
            title="โครงการทั้งหมด (นับอ้างอิง)"
            value={totals.projectsTotal.toLocaleString()}
            hint="รวมจาก coverage"
            color="emerald"
          />
          <StatCard
            icon={<AlertTriangle className="h-5 w-5" />}
            title="ตัวบ่งชี้ที่มีช่องว่าง"
            value={totals.gapsTotal.toLocaleString()}
            hint="ต้องการ Action"
            color="amber"
          />
        </section>

        <section className="mt-6 flex flex-col items-stretch justify-between gap-3 md:flex-row md:items-center">

          <div className="relative w-full md:w-1/2">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="ค้นหาตามโค้ด/ชื่อตัวบ่งชี้…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-sm text-slate-700 shadow-sm placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-100"
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-indigo-500" />
              โครงการ
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-500" />
              ช่องว่าง
            </span>
          </div>
        </section>

        <section className="mt-4 rounded-2xl border border-indigo-100 bg-white shadow-sm">
          <div className="border-b border-indigo-50 px-4 py-3">
            <h2 className="text-sm font-semibold text-slate-800">ภาพรวมความครอบคลุม</h2>
          </div>
          <div className="divide-y divide-slate-100">
            <div className="grid grid-cols-12 gap-2 px-4 py-2 text-xs font-medium text-slate-500">
              <div className="col-span-3 sm:col-span-2">โค้ด</div>
              <div className="col-span-5 sm:col-span-6">ตัวบ่งชี้</div>
              <div className="col-span-2 text-right sm:col-span-2 sm:text-center">โครงการ</div>
              <div className="col-span-2 sm:col-span-2">สถานะ</div>
            </div>

            {filteredCoverage.map((c) => (
              <CoverageRow key={c.code} item={c} />
            ))}

            {filteredCoverage.length === 0 && (
              <div className="px-4 py-10 text-center text-sm text-slate-500">
                ไม่พบรายการตามเงื่อนไขค้นหา
              </div>
            )}
          </div>
        </section>

        <section className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-800">ตัวบ่งชี้ QA ทั้งหมด (อ้างอิง)</h3>
            <span className="text-xs text-slate-500">
              ปี {year} • {MOCK_QA_INDICATORS.filter((i) => !i.year || String(i.year) === year).length} รายการ
            </span>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {MOCK_QA_INDICATORS.filter((i) => !i.year || String(i.year) === year).map((ind) => (
              <IndicatorCard key={ind.code} item={ind} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

/* ===== Sub Components ===== */

function StatCard({
  icon,
  title,
  value,
  hint,
  color = "indigo",
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  hint?: string;
  color?: "indigo" | "emerald" | "amber";
}) {
  const colorMap = {
    indigo: "bg-indigo-50 text-indigo-700 ring-indigo-100",
    emerald: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    amber: "bg-amber-50 text-amber-700 ring-amber-100",
  } as const;

  return (
    <div className="rounded-2xl border border-indigo-100 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <span className={`inline-flex items-center gap-2 rounded-xl px-2.5 py-1 text-xs ring-1 ${colorMap[color]}`}>
          {icon}
          {title}
        </span>
        {hint && <span className="text-xs text-slate-400">{hint}</span>}
      </div>
      <div className="mt-3 text-2xl font-semibold text-slate-900">{value}</div>
    </div>
  );
}

function CoverageRow({ item }: { item: QACoverage }) {
  const pct = Math.min(100, Math.round((item.projects / 80) * 100));
  return (
    <div className="grid grid-cols-12 items-center gap-2 px-4 py-3">
      <div className="col-span-3 sm:col-span-2">
        <span className="inline-flex items-center rounded-lg bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
          {item.code}
        </span>
      </div>

      <div className="col-span-5 sm:col-span-6">
        <div className="text-sm font-medium text-slate-800">{item.name}</div>
        <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-2.5 rounded-full bg-indigo-500 transition-[width]"
            style={{ width: `${pct}%` }}
            title={`โครงการ: ${item.projects.toLocaleString()}`}
          />
        </div>
      </div>

      <div className="col-span-2 text-right text-sm font-medium text-slate-800 sm:col-span-2 sm:text-center">
        {item.projects.toLocaleString()}
      </div>

      <div className="col-span-2">
        {item.gaps ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 ring-1 ring-amber-100">
            <AlertTriangle className="h-3.5 w-3.5" />
            มีช่องว่าง
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-100">
            <CheckCircle2 className="h-3.5 w-3.5" />
            ครอบคลุมดี
          </span>
        )}
      </div>
    </div>
  );
}

function IndicatorCard({ item }: { item: QAIndicator }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
            {item.code}
          </div>
          <div className="mt-2 text-sm font-medium text-slate-900">{item.name}</div>
          {item.year && (
            <div className="mt-1 text-xs text-slate-500">ปีอ้างอิง: {item.year}</div>
          )}
        </div>
        <div className="mt-1 h-8 w-8 shrink-0 rounded-xl bg-indigo-100 text-indigo-700 grid place-items-center text-xs font-semibold">
          QA
        </div>
      </div>
    </div>
  );
}
