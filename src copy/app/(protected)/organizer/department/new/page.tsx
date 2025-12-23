"use client";

import React, { useState } from "react";
import { X, Save } from "lucide-react";
import { useToast } from "@/components/ToastProvider";

type NewDepartment = {
  code: string;
  name: string;
  head: string;
  employees: string;
  projectsCount: string;
};

type AddDepartmentModalProps = {
  open: boolean;
  onClose: () => void;
  onAdd: (d: any) => void;
};

export default function AddDepartmentModal({ open, onClose, onAdd }: AddDepartmentModalProps) {
  const { push } = useToast();

  const initialForm: NewDepartment = {
    code: "",
    name: "",
    head: "",
    employees: "",
    projectsCount: "",
  };

  const [form, setForm] = useState<NewDepartment>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleClose = () => {
    setForm(initialForm);
    setError(null);
    onClose();
  };

  // close on Escape key
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!form.code.trim()) {
      setError("ต้องระบุรหัสหน่วยงาน");
      return;
    }
    if (!form.name.trim()) {
      setError("ต้องระบุชื่อหน่วยงาน");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await new Promise((r) => setTimeout(r, 1000));

      const newDept = {
        code: form.code,
        name: form.name,
        head: form.head || "-",
        employees: form.employees || "0",
        projectsCount: form.projectsCount || "0",
      };

      onAdd(newDept);
      push("success", "สร้างหน่วยงานสำเร็จ", `${form.name} ถูกเพิ่มเข้าระบบแล้ว`);
      handleClose();
    } catch (err: any) {
      console.error(err);
      const errMsg = err?.message ?? "เกิดข้อผิดพลาดในการบันทึกข้อมูล";
      setError(errMsg);
      push("error", "สร้างหน่วยงานไม่สำเร็จ", errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      aria-modal="true"
      role="dialog"
      onClick={handleOverlayClick}
    >
      <div
        className="w-full max-w-md rounded-xl bg-white shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">เพิ่มหน่วยงาน</h2>
          <button
            onClick={handleClose}
            className="rounded-lg p-1 hover:bg-gray-100"
            aria-label="close modal"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-4">
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              รหัสหน่วยงาน <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="code"
              value={form.code}
              onChange={handleChange}
              placeholder="เช่น HR, FIN, ADM"
              disabled={submitting}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ชื่อหน่วยงาน <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="เช่น ฝ่ายบุคคล, ฝ่ายการเงิน"
              disabled={submitting}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              หัวหน้าหน่วยงาน
            </label>
            <input
              type="text"
              name="head"
              value={form.head}
              onChange={handleChange}
              placeholder="ชื่อหัวหน้า"
              disabled={submitting}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-100"
            />
          </div>


          <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              ยกเลิก
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {submitting ? "กำลังบันทึก..." : "บันทึก"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
