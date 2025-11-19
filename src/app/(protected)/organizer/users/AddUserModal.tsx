"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

type NewUser = {
  name: string;
  title: string;
  department?: string;
  status: string;
};

type AddUserModalProps = {
  open: boolean;
  onClose: () => void;
  onAdd: (u: NewUser) => void;
};

export default function AddUserModal({ open, onClose, onAdd }: AddUserModalProps) {
  const [form, setForm] = useState<NewUser>({
    name: "",
    title: "",
    department: "",
    status: "Active",
  });

  if (!open) return null;

  const handleSubmit = () => {
    if (!form.name || !form.title) {
      alert("กรุณากรอกชื่อและตำแหน่ง");
      return;
    }

    onAdd(form);

    // reset form
    setForm({ name: "", title: "", department: "", status: "Active" });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h3 className="text-lg font-semibold text-slate-900">เพิ่มผู้ใช้งานใหม่</h3>

          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">ชื่อผู้ใช้</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="เช่น Somchai K."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">ตำแหน่ง</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="เช่น HR Manager"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">แผนก</label>
            <input
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
              placeholder="เช่น HR / Engineering"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">สถานะ</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
            >
              <option value="Active">Active</option>
              <option value="On leave">On leave</option>
            </select>
          </div>

          {/* Footer */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              ยกเลิก
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              เพิ่มผู้ใช้
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
