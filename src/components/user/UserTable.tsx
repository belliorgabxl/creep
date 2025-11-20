"use client";

import React, { useMemo, useState } from "react";
import { Eye, Edit } from "lucide-react";
import Link from "next/link";

type User = {
  id?: string | number;
  name?: string;
  title?: string;
  department?: string;
  status?: "Active" | "On leave" | "Inactive" | string;
  isActive?: boolean;
  createdAt?: string;
};

interface UsersTableProps {
  users?: User[];
  itemsPerPage?: number;
  viewAllHref?: string;
  onToggleIsActive?: (id?: string | number) => void;
  onEdit?: (u: User) => void;
  onDetails?: (u: User) => void;
}

export default function UsersTable({
  users = [],
  itemsPerPage = 10,
  viewAllHref = "/organizer/users",
  onToggleIsActive,
  onEdit,
  onDetails,
}: UsersTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const rows = useMemo(
    () =>
      users.map((u) => {
        const isActiveComputed = typeof u.isActive === "boolean" ? u.isActive : u.status === "Active";
        const statusLabel = isActiveComputed ? (u.status === "On leave" ? "ลาหยุด" : "ใช้งาน") : "ระงับการใช้งาน";
        return {
          ...u,
          idKey: u.id ?? `${u.name ?? "user"}-${Math.random().toString(36).slice(2, 9)}`,
          isActiveComputed,
          statusLabel,
        };
      }),
    [users]
  );

  const totalPages = Math.max(1, Math.ceil(rows.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRows = rows.slice(startIndex, endIndex);

  const formatDate = (iso?: string | null) => {
    if (!iso) return "-";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString("th-TH", { day: "2-digit", month: "short", year: "numeric" });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-gradient-to-r from-indigo-50/70 to-blue-50/70">
          <tr>
            <th className="p-3 text-center">ชื่อ</th>
            <th className="p-3 text-center">ตำแหน่ง</th>
            <th className="p-3 text-center">แผนก</th>
            <th className="p-3 text-center">สถานะใช้งาน</th>
            <th className="p-3 text-center">วันที่สร้าง</th>
            <th className="p-3 text-center">จัดการ</th>
          </tr>
        </thead>

        <tbody>
          {currentRows.length > 0 ? (
            currentRows.map((u: any) => (
              <tr key={String(u.idKey)} className="hover:bg-gray-50 text-center">
                <td className="p-3">{u.name ?? "-"}</td>
                <td className="p-3">{u.title ?? "-"}</td>
                <td className="p-3">
                  <span className="inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium text-gray-700">
                    {u.department ?? "-"}
                  </span>
                </td>
                <td className="px-3 py-2 text-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleIsActive?.(u.id);
                    }}
                    aria-pressed={u.isActive}
                    title={u.isActive ? "ระงับการใช้งาน" : "เปิดใช้งาน"}
                    className={`relative inline-flex items-center h-6 w-12 rounded-full transition-colors focus:outline-none ${u.isActive ? "bg-green-600" : "bg-gray-300"}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${u.isActive ? "translate-x-6" : "translate-x-1"}`} />
                    <span className="sr-only">{u.statusLabel}</span>
                  </button>
                </td>
                <td className="p-3">{formatDate(u.createdAt)}</td>

                <td className="p-3">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDetails?.(u);
                      }}
                      className="h-8 w-8 rounded-md hover:bg-blue-600/10 hover:text-blue-700 flex items-center justify-center"
                      title="ดูรายละเอียด"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>

                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="p-10 text-center text-sm text-gray-500">
                <div className="space-y-2">
                  <p className="text-base font-medium text-gray-700">ยังไม่มีผู้ใช้ในระบบ</p>
                  <p className="text-xs text-gray-500">คุณสามารถเพิ่มผู้ใช้ใหม่หรือดูรายการทั้งหมดได้จากหน้าจัดการ</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="mt-4 flex items-center justify-between px-2 m-4">
        <p className="text-xs text-gray-600 mb-2">
          แสดง {rows.length === 0 ? 0 : startIndex + 1}-{Math.min(endIndex, rows.length)} จาก {rows.length} รายการ
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1 || rows.length === 0}
            className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 text-xs shadow-sm hover:bg-gray-50 disabled:opacity-50"
          >
            ก่อนหน้า
          </button>

          <span className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700">
            หน้า {currentPage} / {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || rows.length === 0}
            className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 text-xs shadow-sm hover:bg-gray-50 disabled:opacity-50"
          >
            ถัดไป
          </button>
        </div>
      </div>
    </div>
  );
}
