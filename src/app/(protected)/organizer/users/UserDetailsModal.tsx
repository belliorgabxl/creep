// src/app/(protected)/organizer/users/UserDetailsModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { GetUserRespond } from "@/dto/user";

type Props = {
  open: boolean;
  user?: GetUserRespond | null;
  loading?: boolean;
  error?: string | null;
  onClose: () => void;
  statusLabel?: (u: any | null) => string;
};

const FIELD_LABELS: Record<string, string> = {
  id: "รหัส",
  first_name: "ชื่อจริง",
  last_name: "นามสกุล",
  email: "อีเมล",
  position: "ตำแหน่ง",
  department_id: "แผนก (ID)",
  role: "สิทธิ์ในระบบ",
  username: "ชื่อผู้ใช้",
};

// Fields to display in the modal (3 rows × 2 columns)
const DISPLAY_FIELDS = [
  ["username", "email"],
  ["first_name", "last_name"],
  ["position", "role"],
];

export default function UserDetailsModal({ open, user, loading, error, onClose, statusLabel }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<GetUserRespond> | null>(null);

  useEffect(() => {
    if (user && open) {
      setEditData({ ...user });
      setIsEditing(false);
    }
  }, [user, open]);

  const handleEditChange = (key: string, value: string) => {
    if (editData) {
      setEditData({ ...editData, [key]: value });
    }
  };

  const handleSave = () => {
    // TODO: Call API to save user data
    console.log("Saving user data:", editData);
    setIsEditing(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 sticky top-0 bg-white">
          <h3 className="text-lg font-semibold text-slate-900">รายละเอียดผู้ใช้</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            aria-label="close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-sm">
          {loading ? (
            <div className="text-center text-gray-600">กำลังโหลดข้อมูลผู้ใช้...</div>
          ) : error ? (
            <div className="text-center text-red-600">{error}</div>
          ) : !user ? (
            <div className="text-center text-gray-600">ไม่พบข้อมูลผู้ใช้</div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {DISPLAY_FIELDS.map((row, rowIdx) =>
                row.map((key) => {
                  const val = (editData || user)?.[key as keyof GetUserRespond];
                  const isReadOnly = key === "id";
                  return (
                    <div key={key} className="grid grid-cols-1 gap-2">
                      <label className="block text-sm font-medium text-slate-700">{FIELD_LABELS[key] ?? key}</label>
                      {isEditing && !isReadOnly ? (
                        <input
                          type="text"
                          value={String(val ?? "")}
                          onChange={(e) => handleEditChange(key, e.target.value)}
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      ) : (
                        <div className={`w-full rounded-lg border px-3 py-2 text-sm ${isReadOnly ? "bg-slate-50 border-slate-100" : "border-slate-100"}`}>
                          {String(val ?? "-")}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        <div className="px-6 pb-4 flex justify-end gap-2 border-t border-slate-200 pt-4">
          {!isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="rounded-lg bg-indigo-600 text-white px-4 py-2 text-sm font-medium hover:bg-indigo-700"
              >
                แก้ไข
              </button>
              <button
                onClick={onClose}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                ปิด
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleSave}
                className="rounded-lg bg-green-600 text-white px-4 py-2 text-sm font-medium hover:bg-green-700"
              >
                บันทึก
              </button>
              <button
                onClick={() => {
                  setEditData({ ...user });
                  setIsEditing(false);
                }}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                ยกเลิก
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}