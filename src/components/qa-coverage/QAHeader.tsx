"use client";
import React from "react";
import { Plus } from "lucide-react";

type Props = {
  years: number[];
  year: number;
  setYear: (y: number) => void;
  onAdd: () => void;
};

export default function QAHeader({ years, year, setYear, onAdd }: Props) {
  return (
    <header className="border-b border-indigo-100/70 bg-white/90 backdrop-blur">
      <div className="mx-auto max-w-10xl px-4 py-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 ml-4">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-600 text-white shadow">QA</div>
            <div>
              <h1 className="text-lg font-semibold text-slate-900">ความครอบคลุมตัวบ่งชี้ QA</h1>
              <p className="text-xs text-slate-500">ภาพรวมการครอบคลุมตัวบ่งชี้ตามโครงการ และสถานะช่องว่าง</p>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={onAdd}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors"
                title="เพิ่ม QA"
              >
                <Plus className="h-4 w-4" /> เพิ่ม QA
              </button>

              <div className="inline-flex items-center gap-2">
                <span className="text-sm text-slate-600">ปีงบประมาณ</span>
                <select
                  value={String(year)}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="rounded-lg border border-indigo-200 bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm focus:border-indigo-400 focus:outline-none"
                >
                  {years.map((y) => (
                    <option key={y} value={String(y)}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* mobile */}
            <div className="flex md:hidden items-center gap-3">
              <button
                onClick={onAdd}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors"
                title="เพิ่ม QA"
              >
                <Plus className="h-4 w-4" />
              </button>

              <div className="inline-flex items-center gap-2">
                <span className="text-sm text-slate-600">ปี</span>
                <select
                  value={String(year)}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="rounded-lg border border-indigo-200 bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm focus:border-indigo-400 focus:outline-none"
                >
                  {years.map((y) => (
                    <option key={y} value={String(y)}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
