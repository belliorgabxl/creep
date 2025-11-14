"use client";

import { useEffect, useMemo, useState } from "react";
import AddQAModal from "./qa-add-modal";
import QADetailModal from "./qa-detail-modal";
import StatCard from "./component/StatCard";

import QAHeader from "@/components/qa-coverage/QAHeader";
import QAControls from "@/components/qa-coverage/QAControls";
import QAIndicatorsTable from "@/components/qa-coverage/QAIndicatorsTable";

import {
  GetQaIndicatorsByYearFromApi,
  GetQaIndicatorsCountsByYearFromApi
} from "@/api/qa/route";
import type {
  GetQaIndicatorsByYearRespond,
  GetQaIndicatorsCountsByYear,
  GetQaIndicatorsRespond,
} from "@/dto/qaDto";

type NewQA = {
  code: string;
  name: string;
  year?: number;
  projects?: number;
  gaps?: boolean;
};

type SelectedQA = {
  code: string;
  name: string;
  projects: number;
  gaps: boolean;
};

// แปลง พ.ศ. -> ค.ศ.
export function beToCe(yearBe: string | number): number | null {
  const y = Number(yearBe);
  if (Number.isNaN(y)) return null;
  return y - 543;
}

// แปลง ค.ศ. -> พ.ศ.
export function ceToBe(yearCe?: number | null): string | undefined {
  if (yearCe === undefined || yearCe === null) return undefined;
  return String(Number(yearCe) + 543);
}

/** helper: read count from API record (support count_projects or alternative keys) */
function readProjectsCount(rec: any): number {
  if (!rec) return 0;
  if (typeof rec.count_projects === "number") return rec.count_projects;
  if (typeof rec.projects === "number") return rec.projects;
  if (typeof rec.count === "number") return rec.count;
  // fallback if string
  const cand = rec.count_projects ?? rec.projects ?? rec.count ?? rec.total ?? rec.value;
  if (typeof cand === "string" && cand.trim() !== "" && !Number.isNaN(Number(cand))) return Number(cand);
  return 0;
}

export default function QACoveragePage() {
  const years = [2566, 2567, 2568, 2569];
  const [year, setYear] = useState<number>(2568); // BE
  const [query, setQuery] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);

  // selectedQaId: ถ้ามี -> เปิด modal โดย modal เรียก API ด้วย id
  const [selectedQaId, setSelectedQaId] = useState<string | null>(null);

  const [qaIndicators, setQaIndicators] = useState<GetQaIndicatorsByYearRespond[]>([]);
  const [count_data, set_count_data] = useState<GetQaIndicatorsCountsByYear[]>([]);

  // fetch indicators list for selected year (CE)
  useEffect(() => {
    const fetchList = async () => {
      try {
        const year_ce = beToCe(year);
        if (year_ce === null) {
          console.warn("Invalid year conversion from BE to CE:", year);
          setQaIndicators([]);
          return;
        }

        const data = await GetQaIndicatorsByYearFromApi(year_ce);
        setQaIndicators(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch QA indicators by year", err);
        setQaIndicators([]);
      }
    };
    fetchList();
  }, [year]);

  // fetch aggregated counts (may return multiple years)
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const data = await GetQaIndicatorsCountsByYearFromApi();
        set_count_data(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch QA indicators counts:", err);
        set_count_data([]);
      }
    };
    fetchCounts();
  }, []);

  // Filtered (search)
  const filteredIndicators = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return qaIndicators;
    return qaIndicators.filter((it) => {
      const code = (it.code ?? it.id ?? "").toString().toLowerCase();
      const name = (it.name ?? "").toString().toLowerCase();
      const countStr = String(readProjectsCount(it));
      return code.includes(q) || name.includes(q) || countStr.includes(q);
    });
  }, [qaIndicators, query]);

  // totals computed from filteredIndicators (fallback)
  const computedTotals = useMemo(() => {
    const indicatorsTotal = filteredIndicators.length;
    const projectsTotal = filteredIndicators.reduce((s, it) => s + readProjectsCount(it), 0);
    const gapsTotal = filteredIndicators.reduce((acc, it) => acc + (readProjectsCount(it) === 0 ? 1 : 0), 0);
    return { indicatorsTotal, projectsTotal, gapsTotal };
  }, [filteredIndicators]);

  // find aggregated counts for the selected year (count_data likely contains many years)
  const apiCountsForSelectedYear = useMemo(() => {
    const year_ce = beToCe(year);
    if (year_ce === null) return null;
    return count_data.find((c) => c.year === year_ce) ?? null;
  }, [count_data, year]);

  const statIndicators = apiCountsForSelectedYear?.qa_count ?? computedTotals.indicatorsTotal;
  const statProjects = apiCountsForSelectedYear?.total_project_count ?? computedTotals.projectsTotal;
  const statGaps = apiCountsForSelectedYear?.spaces_project_count ?? computedTotals.gapsTotal;

  // handle add: append to local state (UI). Replace with POST call if you want server persist.
  const handleAddQA = (newQA: NewQA) => {
    const year_ce = beToCe(year) ?? undefined;
    const newRecord: GetQaIndicatorsByYearRespond = {
      id: newQA.code,
      code: newQA.code,
      name: newQA.name,
      count_projects: newQA.projects ?? 0,
      year: year_ce ?? 0,
      status: 1,
    } as any;
    setQaIndicators((s) => [newRecord, ...s]);
    setShowAddModal(false);
  };

  const handleUpdateQA = (_updated: SelectedQA) => {
    // If you want to update local list, do it here (find by code and update)
    setSelectedQaId(null);
  };

  // handleView: now parent expects id (string | null) as first arg
  const handleView = (maybeIdOrNull: any, maybeInd?: any) => {
    // If first arg is an id-like value, use it
    const idCandidate = maybeIdOrNull ?? (maybeInd && (maybeInd.id ?? maybeInd.code ?? null));
    const id = idCandidate ? String(idCandidate) : null;

    if (id) {
      setSelectedQaId(id);
      return;
    }

    // fallback: no id available => attempt to open modal with no id (you can change to show local-only view)
    // In this implementation we'll not open modal without id. Instead we can set selectedQaId = null and maybe show a toast.
    // For now, try to see if maybeInd has code that maps to a local record with id
    const local = qaIndicators.find(
      (q) => String(q.code ?? q.id ?? "").toLowerCase() === String(maybeInd?.code ?? maybeInd?.id ?? "").toLowerCase()
    );
    if (local?.id) {
      setSelectedQaId(String(local.id));
      return;
    }

    // If truly no id: open modal with synthetic id? Here we will just console.warn and do nothing.
    console.warn("No id available to fetch details for indicator:", maybeInd);
  };

  return (
    <div className="min-h-screen w-full">
      <QAHeader onAdd={() => setShowAddModal(true)} years={years} year={year} setYear={setYear} />
      <main className="py-8">
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3 px-4">
          <StatCard icon={<></>} title="จำนวนตัวบ่งชี้" value={Number(statIndicators).toLocaleString()} hint={`ปี ${year}`} color="indigo" />
          <StatCard icon={<></>} title="โครงการทั้งหมด (นับจาก API)" value={Number(statProjects).toLocaleString()} hint={`ปี ${year}`} color="emerald" />
          <StatCard icon={<></>} title="ตัวบ่งชี้ที่มีช่องว่าง" value={Number(statGaps).toLocaleString()} hint="ต้องการ Action" color="amber" />
        </section>

        <QAControls query={query} setQuery={setQuery} />

        <section className="mt-6 mx-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-800">ตัวบ่งชี้ QA ทั้งหมด (อ้างอิง)</h3>
            <span className="text-xs text-slate-500">ปี {year} • {filteredIndicators.length} รายการ</span>
          </div>

          <QAIndicatorsTable
            indicators={filteredIndicators.map((it) => ({
              code: it.code ?? it.id ?? "",
              name: it.name ?? "",
              year: it.year ?? undefined,
            }))}
            qaIndicatorsData={filteredIndicators}
            onView={handleView}
          />
        </section>
      </main>

      {showAddModal && <AddQAModal onClose={() => setShowAddModal(false)} onAdd={handleAddQA} year={year} />}

      {/* QADetailModal รับ qaId เป็น string */}
      {selectedQaId && (
        <QADetailModal qaId={selectedQaId} onClose={() => setSelectedQaId(null)} onUpdate={handleUpdateQA} />
      )}
    </div>
  );
}
