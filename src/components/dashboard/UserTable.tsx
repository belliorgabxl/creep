"use client";

import React from "react";

type User = {
  id?: string | number;
  name?: string;
  title?: string;
  department?: string;
  status?: string;
  createdAt?: string;
};

function formatDate(iso?: string) {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("th-TH", { day: "2-digit", month: "short", year: "numeric" });
}

export default function UserTable({ users = [] }: { users: User[] }) {
  return (
      <div className="bg-white rounded-lg shadow-sm overflow-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-gradient-to-r from-indigo-50/70 to-blue-50/70">
          <tr>
            <th className="p-3 text-center">ชื่อ</th>
            <th className="p-3 text-center">ตำแหน่ง</th>
            <th className="p-3 text-center">แผนก</th>
            <th className="p-3 text-center">สถานะ</th>
          </tr>
        </thead>

        <tbody>
          {users.length > 0 ? (
            users.map((u, idx) => {
              const key = u.id ?? `${u.name ?? "user"}-${idx}`;
              return (
                <tr key={key} className="hover:bg-gray-50 text-center">
                  <td className="p-3">{u.name ?? "-"}</td>
                  <td className="p-3">{u.title ?? "-"}</td>
                  <td className="p-3">
                    <span className="inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium text-gray-700">
                      {u.department ?? "-"}
                    </span>
                  </td>
                  <td className="p-3 text-center font-medium">
                    {u.status ?? "-"}
                  </td>
        
                </tr>
              );
            })
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
    </div>
  );
}
