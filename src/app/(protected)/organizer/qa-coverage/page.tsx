"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import AddQAModal from "./qa-add-modal";
import QADetailModal from "./qa-detail-modal";
import StatCard from "./component/StatCard";
import QAHeader from "@/components/qa-coverage/QAHeader";
import QAControls from "@/components/qa-coverage/QAControls";
import QAIndicatorsTable from "@/components/qa-coverage/QAIndicatorsTable";
import {
  DeleteQaFromApi,
  GetQaIndicatorsByYearFromApi,
  GetQaIndicatorsCountsByYearFromApi,
} from "@/api/qa/route";
import type {
  GetQaIndicatorsByYearRespond,
  GetQaIndicatorsCountsByYear,
  GetQaIndicatorsRespond,
} from "@/dto/qaDto";
import { Search } from "lucide-react";

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

function beToCe(yearBe: string | number): number | null {
  const y = Number(yearBe);
  if (Number.isNaN(y)) return null;
  return y - 543;
}

function ceToBe(yearCe?: number | null): string | undefined {
  if (yearCe === undefined || yearCe === null) return undefined;
  return String(Number(yearCe) + 543);
}

function readProjectsCount(rec: any): number {
  if (!rec) return 0;
  if (typeof rec.count_projects === "number") return rec.count_projects;
  if (typeof rec.projects === "number") return rec.projects;
  if (typeof rec.count === "number") return rec.count;
  const cand = rec.count_projects ?? rec.projects ?? rec.count ?? rec.total ?? rec.value;
  if (typeof cand === "string" && cand.trim() !== "" && !Number.isNaN(Number(cand))) return Number(cand);
  return 0;
}

export default function QACoveragePage() {
  const years = [2566, 2567, 2568, 2569];
  const [year, setYear] = useState<number>(2568);
  const [query, setQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedQaId, setSelectedQaId] = useState<string | null>(null);
  const [qaIndicators, setQaIndicators] = useState<GetQaIndicatorsByYearRespond[]>([]);
  const [count_data, set_count_data] = useState<GetQaIndicatorsCountsByYear[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchList = useCallback(async () => {
    try {
      const year_ce = beToCe(year);
      if (year_ce === null) {
        setQaIndicators([]);
        return;
      }
      const data = await GetQaIndicatorsByYearFromApi(year_ce);
      setQaIndicators(Array.isArray(data) ? data : []);
    } catch (err) {
      setQaIndicators([]);
    }
  }, [year]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const data = await GetQaIndicatorsCountsByYearFromApi();
        set_count_data(Array.isArray(data) ? data : []);
      } catch (err) {
        set_count_data([]);
      }
    };
    fetchCounts();
  }, []);

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

  const selectedRecord = selectedQaId
    ? qaIndicators.find((q) => String(q.id) === String(selectedQaId)) ?? null
    : null;

  const apiCountsForSelectedYear = useMemo(() => {
    const year_ce = beToCe(year);
    if (year_ce === null) return null;
    return count_data.find((c) => c.year === year_ce) ?? null;
  }, [count_data, year]);

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

  const handleUpdateQA = useCallback(
    async (updated: any) => {
      try {
        const id = String(updated.id ?? updated.code ?? "");
        if (!id) {
          setSelectedQaId(null);
          await fetchList();
          return;
        }

        setQaIndicators((prev) => {
          const idx = prev.findIndex((p) => String(p.id) === id || String(p.code) === id);
          const newRec: GetQaIndicatorsByYearRespond = {
            id: id,
            code: updated.code ?? (idx > -1 ? prev[idx].code : id),
            name: updated.name ?? (idx > -1 ? prev[idx].name : ""),
            count_projects: typeof updated.projects === "number" ? updated.projects : (idx > -1 ? (prev[idx].count_projects ?? 0) : 0),
            year: typeof updated.year === "number" ? updated.year : (idx > -1 ? prev[idx].year : beToCe(year) ?? 0),
            status: idx > -1 ? (prev[idx].status ?? 1) : 1,
          } as any;

          if (idx > -1) {
            const copy = [...prev];
            copy[idx] = { ...copy[idx], ...newRec };
            return copy;
          } else {
            return [newRec, ...prev];
          }
        });

        setSelectedQaId(null);
        await fetchList();

        try {
          const counts = await GetQaIndicatorsCountsByYearFromApi();
          set_count_data(Array.isArray(counts) ? counts : []);
        } catch (e) {}
      } catch (err) {
        await fetchList();
      }
    },
    [fetchList, year]
  );

  const handleView = (maybeIdOrNull: any, maybeInd?: any) => {
    const idCandidate = maybeIdOrNull ?? (maybeInd && (maybeInd.id ?? maybeInd.code ?? null));
    const id = idCandidate ? String(idCandidate) : null;
    if (id) {
      setSelectedQaId(id);
      return;
    }
    const local = qaIndicators.find(
      (q) => String(q.code ?? q.id ?? "").toLowerCase() === String(maybeInd?.code ?? maybeInd?.id ?? "").toLowerCase()
    );
    if (local?.id) {
      setSelectedQaId(String(local.id));
      return;
    }
  };

  const handleDelete = async (id: string | null, ind?: any) => {
    if (!id) return;
    const ok = window.confirm(`ลบตัวบ่งชี้ "${ind?.name ?? ind?.code ?? id}" จริงหรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้`);
    if (!ok) return;
    const prev = qaIndicators;
    setDeletingId(id);
    setQaIndicators((s) => s.filter((q) => String(q.id) !== String(id)));
    try {
      const success = await DeleteQaFromApi(String(id));
      setDeletingId(null);
      if (!success) {
        setQaIndicators(prev);
        window.alert("ลบไม่สำเร็จ: เซิร์ฟเวอร์ตอบกลับล้มเหลว");
        return;
      }
      try {
        const counts = await GetQaIndicatorsCountsByYearFromApi();
        set_count_data(Array.isArray(counts) ? counts : []);
      } catch (e) {}
      window.alert("ลบตัวบ่งชี้สำเร็จ");
    } catch (err: any) {
      setQaIndicators(prev);
      setDeletingId(null);
      window.alert("เกิดข้อผิดพลาดขณะลบ (ดูคอนโซลสำหรับรายละเอียด)");
    }
  };

  return (
    <div className="min-h-screen w-full">
      <QAHeader onAdd={() => setShowAddModal(true)} years={years} year={year} setYear={setYear} />
      <main className="py-2">
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
        </section>

        <section className="mt-6 mx-4">
          <div className="mb-2 flex items-center justify-between mx-4 my-2">
            <h3 className="text-sm font-semibold text-slate-800">ตัวบ่งชี้ QA ทั้งหมด</h3>
            <span className="text-xs text-slate-500">ปี {year} • {filteredIndicators.length} รายการ</span>
          </div>

          <div className="min-h-[420px] transition-all duration-200 ease-in-out">
            <QAIndicatorsTable
              qaIndicatorsData={filteredIndicators}
              onView={handleView}
              onDelete={handleDelete}
            />
          </div>
        </section>
      </main>

      {showAddModal && <AddQAModal onClose={() => setShowAddModal(false)} onAdd={handleAddQA} year={year} />}
      {selectedQaId && (
        <QADetailModal
          qaId={selectedQaId}
          initialData={selectedRecord}
          onClose={() => setSelectedQaId(null)}
          onUpdate={handleUpdateQA}
        />
      )}
    </div>
  );
}
