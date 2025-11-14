"use client";

import { useMemo, useState } from "react";
import { Search, CheckCircle2, AlertTriangle, Layers3, Plus, Eye } from "lucide-react";
import {
  MOCK_QA_COVERAGE,
  MOCK_QA_INDICATORS,
  type QACoverage,
  type QAIndicator,
} from "@/app/mock";

import AddQAModal from "./qa-add-modal";
import QADetailModal from "./qa-detail-modal";
import CoverageRow from "./component/CoverageRow";
import StatCard from "./component/StatCard";
import IndicatorCard from "./component/IndicatorCard";

type NewQA = {
  code: string;
  name: string;
  year?: number;
  projects?: number;
  gaps?: boolean;
};

export default function QACoveragePage() {
  const years = ["2566", "2567", "2568", "2569"];
  const [year, setYear] = useState<string>("2568");
  const [query, setQuery] = useState("");

  const [coverageList, setCoverageList] = useState<QACoverage[]>(MOCK_QA_COVERAGE);
  const [qaList, setQaList] = useState<QAIndicator[]>(MOCK_QA_INDICATORS as QAIndicator[]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedQA, setSelectedQA] = useState<QACoverage | null>(null);

  const filteredCoverage = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base: QACoverage[] = coverageList;
    if (!q) return base;
    return base.filter(
      (c) =>
        c.code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        String(c.projects).includes(q)
    );
  }, [query, coverageList]);

  const totals = useMemo(() => {
    const indicatorsTotal = qaList.filter((i) => !i.year || String(i.year) === year).length;
    const projectsTotal = filteredCoverage.reduce((sum, c) => sum + (c.projects || 0), 0);
    const gapsTotal = filteredCoverage.filter((c) => c.gaps).length;
    return { indicatorsTotal, projectsTotal, gapsTotal };
  }, [year, filteredCoverage, qaList]);

  const handleAddQA = (newQA: NewQA) => {
    // เพิ่มลง qaList (QAIndicator)
    setQaList((s) => [...s, { code: newQA.code, name: newQA.name, year: newQA.year } as QAIndicator]);

    // เพิ่มลง coverageList (QACoverage) — กำหนด default สำหรับ projects/gaps
    setCoverageList((s) => [
      ...s,
      {
        code: newQA.code,
        name: newQA.name,
        projects: newQA.projects ?? 0,
        gaps: newQA.gaps ?? true,
      } as QACoverage,
    ]);

    setShowAddModal(false);
  };

  const handleUpdateQA = (updated: QACoverage) => {
    setCoverageList((s) => s.map((c) => (c.code === updated.code ? updated : c)));
    setSelectedQA(null);
  };

  return (
    <div className="min-h-screen w-full">
      <header className="sticky top-0 z-40 w-full border-b border-indigo-100/70 bg-white/90 backdrop-blur">
        <div className="mx-auto max-w-10xl px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-600 text-white shadow">QA</div>
              <div>
                <h1 className="text-lg font-semibold text-slate-900">ความครอบคลุมตัวบ่งชี้ QA</h1>
                <p className="text-xs text-slate-500">ภาพรวมการครอบคลุมตัวบ่งชี้ตามโครงการ และสถานะช่องว่าง</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors"
                title="เพิ่ม QA"
              >
                <Plus className="h-4 w-4" /> เพิ่ม QA
              </button>

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
        </div>
      </header>

      <main className="py-8">
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3 px-4">
          <StatCard icon={<Layers3 className="h-5 w-5" />} title="จำนวนตัวบ่งชี้" value={totals.indicatorsTotal.toLocaleString()} hint={`ปี ${year}`} color="indigo" />
          <StatCard icon={<CheckCircle2 className="h-5 w-5" />} title="โครงการทั้งหมด (นับอ้างอิง)" value={totals.projectsTotal.toLocaleString()} hint="รวมจาก coverage" color="emerald" />
          <StatCard icon={<AlertTriangle className="h-5 w-5" />} title="ตัวบ่งชี้ที่มีช่องว่าง" value={totals.gapsTotal.toLocaleString()} hint="ต้องการ Action" color="amber" />
        </section>

        <section className="mt-6 flex flex-col items-stretch justify-between gap-3 md:flex-row md:items-center px-4">
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
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-indigo-500" /> โครงการ
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-500" /> ช่องว่าง
            </span>
          </div>
        </section>

        <section className="mt-4 rounded-2xl border border-indigo-100 bg-white shadow-sm mx-4">
          <div className="border-b border-indigo-50 px-4 py-3">
            <h2 className="text-sm font-semibold text-slate-800">ภาพรวมความครอบคลุม</h2>
          </div>
          <div className="divide-y divide-slate-100">
            <div className="grid grid-cols-12 gap-2 px-4 py-2 text-xs font-medium text-slate-500">
              <div className="col-span-3 sm:col-span-2">โค้ด</div>
              <div className="col-span-5 sm:col-span-6">ตัวบ่งชี้</div>
              <div className="col-span-2 text-right sm:col-span-2 sm:text-center">โครงการ</div>
              <div className="col-span-2 sm:col-span-2">สถานะ</div>
              <div className="col-span-1 text-center">การดำเนินการ</div>
            </div>

            {filteredCoverage.map((c) => (
              <CoverageRow key={c.code} item={c} onViewDetail={() => setSelectedQA(c)} />
            ))}

            {filteredCoverage.length === 0 && <div className="px-4 py-10 text-center text-sm text-slate-500">ไม่พบรายการตามเงื่อนไขค้นหา</div>}
          </div>
        </section>

        <section className="mt-6 px-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-800">ตัวบ่งชี้ QA ทั้งหมด (อ้างอิง)</h3>
            <span className="text-xs text-slate-500">
              ปี {year} • {qaList.filter((i) => !i.year || String(i.year) === year).length} รายการ
            </span>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {qaList
              .filter((i) => !i.year || String(i.year) === year)
              .map((ind) => (
                <IndicatorCard
                  key={ind.code}
                  item={ind}
                  onView={() =>
                    setSelectedQA(
                      (coverageList.find((c) => c.code === ind.code) as QACoverage) || {
                        code: ind.code,
                        name: ind.name,
                        projects: 0,
                        gaps: true,
                      }
                    )
                  }
                />
              ))}
          </div>
        </section>
      </main>

      {showAddModal && <AddQAModal onClose={() => setShowAddModal(false)} onAdd={handleAddQA} year={year} />}

      {selectedQA && <QADetailModal qa={selectedQA} onClose={() => setSelectedQA(null)} onUpdate={handleUpdateQA} />}
    </div>
  );
}