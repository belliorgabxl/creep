// components/AddQAModal.tsx
"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
// import type { QACoverage } from "@/app/mock"; // <-- ใช้ชนิดจาก mock ของคุณ

type AddQAModalProps = {
  onClose: () => void;
  // ให้รับ partial ของ QACoverage (but require code/name)
  onAdd: (newQA: { code: string; name: string; year?: number; projects?: number; gaps?: boolean }) => void;
  year: string | number;
};
export default function AddQAModal({ onClose, onAdd, year }: AddQAModalProps) {
  const [formData, setFormData] = useState<{ code: string; name: string; year?: number }>({
    code: "",
    name: "",
    year: typeof year === "string" ? parseInt(year || "0") || undefined : (year as number | undefined),
  });

  const handleSubmit = () => {
    if (!formData.code || !formData.name) return;
    // ส่งค่าในรูปแบบที่ onAdd คาดหวัง (projects default 0, gaps default true)
    onAdd({
      code: formData.code,
      name: formData.name,
      year: formData.year,
      projects: 0,
      gaps: true,
    });
    setFormData({ code: "", name: "", year: typeof year === "string" ? parseInt(year || "0") || undefined : (year as number | undefined) });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h3 className="text-lg font-semibold text-slate-900">เพิ่มตัวบ่งชี้ QA</h3>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors" aria-label="close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">รหัสตัวบ่งชี้</label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              placeholder="เช่น QA-006"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">ชื่อตัวบ่งชี้</label>
            <textarea
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="ระบุชื่อตัวบ่งชี้"
              rows={3}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">ปีงบประมาณ</label>
            <input
              type="number"
              value={formData.year ?? ""}
              onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || undefined })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button onClick={onClose} className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
              ยกเลิก
            </button>
            <button onClick={handleSubmit} className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors">
              เพิ่มตัวบ่งชี้
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
