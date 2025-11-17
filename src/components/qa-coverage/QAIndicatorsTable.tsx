"use client";

import React from "react";
import type { GetQaIndicatorsByYearRespond } from "@/dto/qaDto";
import { Eye, Trash2 } from "lucide-react";

type Props = {
  qaIndicatorsData: GetQaIndicatorsByYearRespond[]; // จาก API
  onView: (id: string | null, indOrCount?: any) => void;
  onDelete?: (id: string | null, ind?: any) => void; // optional delete handler
};

/**
 * หาฟิลด์ตัวเลขจำนวนโครงการจาก object ที่หลากหลายรูปแบบ
 * รองรับทั้ง `count_projects` (ตาม type), `count_project` (จาก API บางตัว),
 * `projects`, `count`, `total`, และ nested `stats`.
 */
function extractCountFromApi(item: any): number | null {
  if (!item || typeof item !== "object") return null;

  const keysToTry = [
    "count_projects",
    "count_project", // <-- บาง API ส่งชื่อแบบนี้
    "projects",
    "projectCount",
    "project_count",
    "project_total",
    "project_count_total",
    "count",
    "total",
    "value",
    "amount",
    "project",
  ];

  for (const k of keysToTry) {
    if (k in item) {
      const v = item[k];
      if (typeof v === "number" && Number.isFinite(v)) return v;
      if (typeof v === "string" && v.trim() !== "" && !Number.isNaN(Number(v))) return Number(v);
    }
  }

  // nested stats
  if (item.stats && typeof item.stats === "object") {
    return extractCountFromApi(item.stats);
  }

  return null;
}

export default function QAIndicatorsTable({ qaIndicatorsData = [], onView, onDelete }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-indigo-100 bg-white shadow-sm">
      {/* desktop */}
      <table className="min-w-full table-auto hidden md:table">
        <thead className="bg-slate-50">
          <tr className="text-xs text-slate-500">
            <th className="px-4 py-3 text-center">โค้ด</th>
            <th className="px-4 py-3 text-center">ตัวบ่งชี้</th>
            <th className="px-4 py-3 text-center">ปี</th>
            <th className="px-4 py-3 text-center">จำนวนโครงการที่เชื่อมโยง</th>
            <th className="px-4 py-3 text-center">การดำเนินการ</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {qaIndicatorsData.map((ind) => {
            const projects = extractCountFromApi(ind) ?? 0;
            const canDelete = projects === 0;

            return (
              <tr key={ind.id} className="hover:bg-slate-50">
                <td className="px-4 py-4 text-sm text-slate-700 text-center align-middle">{ind.code}</td>
                <td className="px-4 py-4 text-sm text-slate-700 text-center align-middle">{ind.name}</td>
                <td className="px-4 py-4 text-sm text-slate-500 text-center align-middle">{ind.year ?? "-"}</td>
                <td className="px-4 py-4 text-sm text-slate-700 text-center align-middle">{projects.toLocaleString()}</td>
                <td className="px-4 py-4 text-sm text-center align-middle">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => {
                        const idToSend = ind.id ?? null;
                        onView(idToSend ? String(idToSend) : null, ind);
                      }}
                      className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700 shadow-sm hover:bg-slate-50"
                      title="ดูรายละเอียด"
                    >
                      <Eye className="h-4 w-4" /> ดู
                    </button>

                    <button
                      onClick={() => onDelete && onDelete(ind.id ?? null, ind)}
                      disabled={!canDelete}
                      className={`inline-flex items-center gap-2 rounded-md border px-3 py-1 text-sm shadow-sm ${
                        canDelete
                          ? "border-rose-200 bg-white text-rose-600 hover:bg-rose-50"
                          : "border-slate-100 bg-slate-50 text-slate-400 opacity-60 cursor-not-allowed"
                      }`}
                      title={canDelete ? "ลบตัวบ่งชี้" : "มีโครงการเชื่อมโยงอยู่ ไม่สามารถลบได้"}
                    >
                      <Trash2 className="h-4 w-4" /> ลบ
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* mobile */}
      <div className="flex flex-col gap-2 p-3 md:hidden">
        {qaIndicatorsData.map((ind) => {
          const projects = extractCountFromApi(ind) ?? 0;
          const canDelete = projects === 0;

          return (
            <div key={ind.id} className="rounded-lg border border-slate-100 bg-white p-3 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <div className="text-xs text-slate-500">โค้ด</div>
                  <div className="text-sm font-medium text-slate-700">{ind.code}</div>
                </div>

                <div className="text-center">
                  <div className="text-xs text-slate-500">ปี</div>
                  <div className="text-sm text-slate-700">{ind.year ?? "-"}</div>
                </div>
              </div>

              <div className="mt-2 text-center">
                <div className="text-xs text-slate-500">ตัวบ่งชี้</div>
                <div className="text-sm text-slate-700">{ind.name}</div>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div className="text-sm text-slate-500">
                  โครงการ:
                  <span className="text-slate-700 ml-2">{projects.toLocaleString()}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const idToSend = ind.id ?? null;
                      onView(idToSend ? String(idToSend) : null, ind);
                    }}
                    className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700 shadow-sm hover:bg-slate-50"
                    title="ดูรายละเอียด"
                  >
                    <Eye className="h-4 w-4" /> ดู
                  </button>

                  <button
                    onClick={() => onDelete && onDelete(ind.id ?? null, ind)}
                    disabled={!canDelete}
                    className={`inline-flex items-center gap-2 rounded-md border px-3 py-1 text-sm shadow-sm ${
                      canDelete
                        ? "border-rose-200 bg-white text-rose-600 hover:bg-rose-50"
                        : "border-slate-100 bg-slate-50 text-slate-400 opacity-60 cursor-not-allowed"
                    }`}
                    title={canDelete ? "ลบตัวบ่งชี้" : "มีโครงการเชื่อมโยงอยู่ ไม่สามารถลบได้"}
                  >
                    <Trash2 className="h-4 w-4" /> ลบ
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
