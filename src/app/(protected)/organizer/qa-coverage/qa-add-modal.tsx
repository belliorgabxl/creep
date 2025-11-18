// components/AddQAModal.tsx
"use client";

import React, { useMemo, useState, useRef, useEffect, useCallback } from "react";
import { X } from "lucide-react";
import { CreateQaFromApi } from "@/api/qa/route";
import type { QaRequest } from "@/dto/qaDto";

type AddQAModalProps = {
  onClose: () => void;
  // ให้รับ partial ของ QACoverage (but require code/name)
  onAdd: (newQA: { code: string; name: string; year?: number; projects?: number; gaps?: boolean }) => void;
  year: string | number;
  // organizationId ถูกตัดออก — แบ็คเอนด์จะอ่านจากคุกกี้
};

function beToCe(yearBe?: number | string | null): number | null {
  if (yearBe === undefined || yearBe === null) return null;
  const n = Number(yearBe);
  if (Number.isNaN(n)) return null;
  return n - 543;
}

export default function AddQAModal({ onClose, onAdd, year }: AddQAModalProps) {
  const currentBe = useMemo(() => {
    const now = new Date();
    return now.getFullYear() + 543;
  }, []);

  const yearOptions = useMemo(() => {
    const start = currentBe - 3;
    const end = currentBe + 5;
    const arr: number[] = [];
    for (let y = start; y <= end; y++) arr.push(y);
    return arr;
  }, [currentBe]);

  // initial form factory so we can reset easily
  const initialForm = useMemo(
    () => ({
      code: "",
      name: "",
      description: "",
      year: typeof year === "string" ? (parseInt(year || "0") || undefined) : (year as number | undefined),
    }),
    [year]
  );

  const [formData, setFormData] = useState<{ code: string; name: string; description: string; year?: number }>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const modalRef = useRef<HTMLDivElement | null>(null);
  const closingRef = useRef(false); // prevent double close while async

  const resetForm = useCallback(() => {
    setFormData(initialForm);
    setError(null);
    setLoading(false);
  }, [initialForm]);

  const handleClose = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    resetForm();
    // small timeout to ensure state reset UI updates before parent hides modal (optional)
    // but we can call onClose immediately
    onClose();
    // allow future opens to work
    setTimeout(() => {
      closingRef.current = false;
    }, 0);
  }, [onClose, resetForm]);

  // close when click outside modal (anywhere outside modalRef)
  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      const el = modalRef.current;
      if (!el) return;
      const target = e.target as Node | null;
      if (target && !el.contains(target)) {
        handleClose();
      }
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        handleClose();
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [handleClose]);

  const validate = (): string | null => {
    if (!formData.code || formData.code.trim() === "") return "กรุณากรอกรหัสตัวบ่งชี้";
    if (!formData.name || formData.name.trim() === "") return "กรุณากรอกชื่อตัวบ่งชี้";
    if (!formData.description || formData.description.trim() === "") return "กรุณากรอกคำอธิบาย";
    if (!formData.year) return "กรุณาเลือกปีงบประมาณ";
    return null;
  };

  const handleSubmit = async () => {
    setError(null);
    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    const yearCe = beToCe(formData.year as number);
    if (yearCe === null) {
      setError("ปีไม่ถูกต้อง");
      return;
    }

    const payload: QaRequest = {
      code: formData.code.trim(),
      description: formData.description.trim(),
      display_order: 1, // ตั้งเป็น 1 เสมอ
      name: formData.name.trim(),
      organization_id: "", // backend จะอ่านจาก cookie
      year: yearCe,
    };

    try {
      setLoading(true);
      const ok = await CreateQaFromApi(payload);
      setLoading(false);
      if (!ok) {
        setError("สร้างตัวบ่งชี้ไม่สำเร็จ (API คืนค่าไม่สำเร็จ)");
        return;
      }

      // เรียก onAdd เพื่อให้ parent อัปเดต UI (projects default 0)
      onAdd({
        code: payload.code,
        name: payload.name,
        year: formData.year, // เก็บเป็น พ.ศ. เพื่อแสดง
        projects: 0,
        gaps: true,
      });

      // รีเซ็ตและปิด
      resetForm();
      onClose();
    } catch (err: any) {
      console.error("CreateQaFromApi error:", err);
      setLoading(false);
      setError(err?.message ?? "เกิดข้อผิดพลาดขณะสร้างตัวบ่งชี้");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      {/* NOTE: backdrop still present but outside clicks are handled globally via pointerdown */}
      <div
        ref={modalRef}
        className="w-full max-w-md rounded-2xl bg-white shadow-xl"
        // prevent clicks inside modal from propagating to document pointerdown handler in some browsers
        onPointerDown={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h3 className="text-lg font-semibold text-slate-900">เพิ่มตัวบ่งชี้ QA</h3>
          <button
            onClick={handleClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            aria-label="close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {error ? <div className="text-sm text-rose-600">{error}</div> : null}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">รหัสตัวบ่งชี้</label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              placeholder="เช่น QA-006"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">ชื่อตัวบ่งชี้</label>
            <textarea
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="ระบุชื่อตัวบ่งชี้"
              rows={2}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">คำอธิบาย</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="คำอธิบายสั้น ๆ"
              rows={3}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">ปีงบประมาณ (พ.ศ.)</label>
            <select
              value={formData.year ?? ""}
              onChange={(e) => setFormData({ ...formData, year: e.target.value ? parseInt(e.target.value) : undefined })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              disabled={loading}
            >
              <option value="">-- เลือกปีงบประมาณ (พ.ศ.) --</option>
              {yearOptions.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-slate-400">เลือกปีเป็น พ.ศ. (ระบบจะแปลงเป็น ค.ศ. ก่อนส่ง)</p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleClose}
              className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              disabled={loading}
            >
              ยกเลิก
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "กำลังเพิ่ม..." : "เพิ่มตัวบ่งชี้"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
