"use client";

import React from "react";
import type { QAIndicator } from "@/app/mock";
import type { GetQaIndicatorsByYearRespond } from "@/dto/qaDto";
import { Eye } from "lucide-react";

type Props = {
  indicators: QAIndicator[];
  qaIndicatorsData: GetQaIndicatorsByYearRespond[]; // จาก API
  // onView: (id: string | null, indOrCount?: any) => void
  onView: (id: string | null, indOrCount?: any) => void;
};

/**
 * หาฟิลด์ตัวเลขจำนวนโครงการจาก object ที่หลากหลายรูปแบบ
 */
function extractCountFromApi(item: any): number | null {
  if (!item || typeof item !== "object") return null;

  const keysToTry = [
    "count_projects",
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

/**
 * พยายาม match เรคคอร์ด API กับ indicator โดยดูจากรหัสก่อน แล้วค่อยเทียบชื่อ
 */
function findApiRecordForIndicator(ind: QAIndicator, data: GetQaIndicatorsByYearRespond[] = []) {
  const codeLower = String(ind.code).toLowerCase();
  const nameLower = (ind.name ?? "").toLowerCase();

  // primary: exact code match (case-insensitive)
  let rec = data.find((d) => {
    if (!d) return false;
    const cand = (d.code ?? d.id ?? d.name ?? "").toString().toLowerCase();
    return cand === codeLower;
  });

  if (rec) return rec;

  // try loosen: code includes / equals ignoring punctuation
  rec = data.find((d) => {
    if (!d) return false;
    const cand = (d.code ?? d.id ?? "").toString().toLowerCase();
    return cand === codeLower || cand.includes(codeLower) || codeLower.includes(cand);
  });

  if (rec) return rec;

  // fallback: name includes
  rec = data.find((d) => {
    if (!d || !d.name) return false;
    return d.name.toString().toLowerCase().includes(nameLower) || nameLower.includes(d.name.toString().toLowerCase());
  });

  return rec ?? null;
}

export default function QAIndicatorsTable({ indicators, qaIndicatorsData = [], onView }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-indigo-100 bg-white shadow-sm">
      {/* desktop */}
      <table className="min-w-full table-auto hidden md:table">
        <thead className="bg-slate-50">
          <tr className="text-xs text-slate-500">
            <th className="px-4 py-3 text-center">โค้ด</th>
            <th className="px-4 py-3 text-center">ตัวบ่งชี้</th>
            <th className="px-4 py-3 text-center">ปี</th>
            <th className="px-4 py-3 text-center">โครงการ (จาก API)</th>
            <th className="px-4 py-3 text-center">สถานะช่องว่าง</th>
            <th className="px-4 py-3 text-center">การดำเนินการ</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {indicators.map((ind) => {
            const rec = findApiRecordForIndicator(ind, qaIndicatorsData);
            const projects = extractCountFromApi(rec) ?? 0;
            const isGap = projects === 0;

            return (
              <tr key={ind.code} className="hover:bg-slate-50">
                <td className="px-4 py-4 text-sm text-slate-700 text-center align-middle">{ind.code}</td>
                <td className="px-4 py-4 text-sm text-slate-700 text-center align-middle">{ind.name}</td>
                <td className="px-4 py-4 text-sm text-slate-500 text-center align-middle">{ind.year ?? "-"}</td>
                <td className="px-4 py-4 text-sm text-slate-700 text-center align-middle">{projects.toLocaleString()}</td>
                <td className="px-4 py-4 text-sm text-center align-middle">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-2 py-1 text-xs font-medium ${
                      isGap ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {isGap ? "ช่องว่าง" : "มีข้อมูล"}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-center align-middle">
                  <div className="flex items-center justify-center">
                    <button
                      onClick={() => {
                        // ส่ง id เป็น arg แรก (prefer rec?.id). ถ้าไม่มี id ให้ส่ง null เป็น fallback
                        const idToSend = rec?.id ?? (ind as any)?.id ?? null;
                        onView(idToSend ? String(idToSend) : null, ind);
                      }}
                      className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700 shadow-sm hover:bg-slate-50"
                      title="ดูรายละเอียด"
                    >
                      <Eye className="h-4 w-4" /> ดู
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
        {indicators.map((ind) => {
          const rec = findApiRecordForIndicator(ind, qaIndicatorsData);
          const projects = extractCountFromApi(rec) ?? 0;
          const isGap = projects === 0;

          return (
            <div key={ind.code} className="rounded-lg border border-slate-100 bg-white p-3 shadow-sm">
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
                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-2 py-1 text-xs font-medium ${
                      isGap ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {isGap ? "ช่องว่าง" : "มีข้อมูล"}
                  </span>

                  <button
                    onClick={() => {
                      const idToSend = rec?.id ?? (ind as any)?.id ?? null;
                      onView(idToSend ? String(idToSend) : null, ind);
                    }}
                    className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700 shadow-sm hover:bg-slate-50"
                    title="ดูรายละเอียด"
                  >
                    <Eye className="h-4 w-4" /> ดู
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
