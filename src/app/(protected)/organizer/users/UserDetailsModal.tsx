// components/UserDetailsModal.tsx
"use client";

import React from "react";
import { X } from "lucide-react";

type User = {
  id: string;
  name?: string;
  title?: string;
  department?: string;
  status?: string;
  isActive?: boolean;
  createdAt?: string;
};

type Props = {
  open: boolean;
  user?: User | null;
  onClose: () => void;
  statusLabel?: (u: User | null) => string;
};

export default function UserDetailsModal({ open, user, onClose, statusLabel }: Props) {
  if (!open || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
        {/* Header (matching AddQAModal) */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h3 className="text-lg font-semibold text-slate-900">รายละเอียดผู้ใช้</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            aria-label="close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body: single-column layout */}
        <div className="p-6 space-y-4 text-sm">
          <div className="grid grid-cols-1 gap-2">
            <label className="block text-sm font-medium text-slate-700">รหัส</label>
            <div className="w-full rounded-lg border border-slate-100 px-3 py-2 text-sm bg-slate-50">{user.id}</div>
          </div>

          <div className="grid grid-cols-1 gap-2">
            <label className="block text-sm font-medium text-slate-700">ชื่อ</label>
            <div className="w-full rounded-lg border border-slate-100 px-3 py-2 text-sm">{user.name ?? "-"}</div>
          </div>

          <div className="grid grid-cols-1 gap-2">
            <label className="block text-sm font-medium text-slate-700">ตำแหน่ง</label>
            <div className="w-full rounded-lg border border-slate-100 px-3 py-2 text-sm">{user.title ?? "-"}</div>
          </div>

          <div className="grid grid-cols-1 gap-2">
            <label className="block text-sm font-medium text-slate-700">แผนก</label>
            <div className="w-full rounded-lg border border-slate-100 px-3 py-2 text-sm">{user.department ?? "-"}</div>
          </div>

          <div className="grid grid-cols-1 gap-2">
            <label className="block text-sm font-medium text-slate-700">สถานะการใช้งาน</label>
            <div className="w-full rounded-lg border border-slate-100 px-3 py-2 text-sm">
              {statusLabel ? statusLabel(user) : (user.isActive ? "ใช้งาน" : "ระงับการใช้งาน")}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2">
            <label className="block text-sm font-medium text-slate-700">วันที่สร้าง</label>
            <div className="w-full rounded-lg border border-slate-100 px-3 py-2 text-sm">{user.createdAt ?? "-"}</div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-4 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
}
