// components/QADetailModal.tsx
"use client";

import React, { useEffect, useState } from "react";
import { X, Edit2, Save, AlertTriangle, CheckCircle2 } from "lucide-react";
import type { QACoverage } from "@/app/mock"; // <-- ใช้ชนิดจาก mock ของคุณ

type QADetailModalProps = {
  qa: QACoverage;
  onClose: () => void;
  onUpdate: (updated: QACoverage) => void; // <-- ตรงกับ QACoverage
};

export default function QADetailModal({ qa, onClose, onUpdate }: QADetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<QACoverage>({ ...qa });

  useEffect(() => {
    setFormData({ ...qa });
  }, [qa]);

  const handleSave = () => {
    // ensure projects is number (ไม่ undefined)
    const safe: QACoverage = {
      ...formData,
      projects: formData.projects ?? 0,
      gaps: !!formData.gaps,
    };
    onUpdate(safe);
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <h3 className="text-lg font-semibold text-slate-900">รายละเอียดตัวบ่งชี้ QA</h3>
          <div className="flex items-center gap-2">
            {!isEditing ? (
              <button onClick={() => setIsEditing(true)} className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50 transition-colors">
                <Edit2 className="h-4 w-4" /> แก้ไข
              </button>
            ) : (
              <button onClick={handleSave} className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors">
                <Save className="h-4 w-4" /> บันทึก
              </button>
            )}
            <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors" aria-label="close">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100/50 p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="inline-flex items-center rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-indigo-700 shadow-sm">
                  {formData.code}
                </div>
                {!isEditing ? (
                  <h4 className="mt-3 text-xl font-semibold text-slate-900">{formData.name}</h4>
                ) : (
                  <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="mt-3 w-full rounded-lg border border-indigo-200 px-3 py-2 text-lg font-semibold focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100" />
                )}
              </div>
              <div className="h-12 w-12 shrink-0 rounded-xl bg-indigo-600 text-white grid place-items-center text-lg font-bold shadow-lg">QA</div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs font-medium text-slate-600 mb-1">จำนวนโครงการ</div>
              {!isEditing ? (
                <div className="text-2xl font-bold text-slate-900">{(formData.projects ?? 0).toLocaleString()}</div>
              ) : (
                <input type="number" value={formData.projects ?? 0} onChange={(e) => setFormData({ ...formData, projects: parseInt(e.target.value) || 0 })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xl font-bold focus:border-indigo-500 focus:outline-none" />
              )}
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs font-medium text-slate-600 mb-1">สถานะช่องว่าง</div>
              {!isEditing ? (
                <div className="mt-2">
                  {formData.gaps ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1.5 text-sm font-semibold text-amber-700">
                      <AlertTriangle className="h-4 w-4" /> มีช่องว่าง
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1.5 text-sm font-semibold text-emerald-700">
                      <CheckCircle2 className="h-4 w-4" /> ครอบคลุมดี
                    </span>
                  )}
                </div>
              ) : (
                <label className="flex items-center gap-3 mt-2 cursor-pointer">
                  <input type="checkbox" checked={!!formData.gaps} onChange={(e) => setFormData({ ...formData, gaps: e.target.checked })} className="h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-2 focus:ring-indigo-100" />
                  <span className="text-sm font-medium text-slate-700">มีช่องว่างที่ต้องแก้ไข</span>
                </label>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h5 className="text-sm font-semibold text-slate-800 mb-3">ข้อมูลเพิ่มเติม</h5>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">ความครอบคลุม</span>
                <span className="font-medium text-slate-900">{Math.min(100, Math.round(((formData.projects ?? 0) / 80) * 100))}%</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">วันที่อัพเดทล่าสุด</span>
                <span className="font-medium text-slate-900">{new Date().toLocaleDateString("th-TH")}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-600">สถานะ</span>
                <span className={`font-medium ${formData.gaps ? "text-amber-600" : "text-emerald-600"}`}>{formData.gaps ? "ต้องการการดำเนินการ" : "ปกติ"}</span>
              </div>
            </div>
          </div>

          {formData.gaps && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <div className="flex gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h6 className="text-sm font-semibold text-amber-900 mb-1">แนวทางการแก้ไข</h6>
                  <p className="text-sm text-amber-800">ตัวบ่งชี้นี้มีช่องว่างในการครอบคลุม ควรพิจารณาเพิ่มโครงการหรือปรับปรุงกระบวนการเพื่อให้ครอบคลุมมากขึ้น</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
