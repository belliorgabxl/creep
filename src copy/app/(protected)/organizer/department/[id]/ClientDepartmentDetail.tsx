// src/app/(protected)/organizer/department/[id]/ClientDepartmentDetail.tsx
"use client";

import React, { useEffect, useState } from "react";
import { GetDepartmentsDetailByIdApi } from "@/api/department/route"; // ปรับ path ตามโปรเจค
import { GetUserByDepartmentIdFromApi } from "@/api/hr/route"; // ปรับ path ตามโปรเจค
import type { Department } from "@/dto/projectDto"; // ปรับ path dto ตามโปรเจค
import type { GetUserRespond } from "@/dto/userDto";
import Link from "next/link";
import UserTable from "@/components/dashboard/UserTable";

/* UI helpers (CodeBadge, Muted, StatCard, DetailItem) — ยกมาจากไฟล์เดิม */
function CodeBadge({ children }: React.PropsWithChildren) {
  return (
    <span className="inline-flex items-center rounded-md border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-700">
      {children}
    </span>
  );
}
function Muted({ children }: React.PropsWithChildren) {
  return <span className="text-gray-500">{children}</span>;
}
function StatCard({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</div>
      <div className="mt-1 text-lg font-semibold text-gray-900 tabular-nums">{value}</div>
    </div>
  );
}
function DetailItem({
  label,
  children,
}: React.PropsWithChildren<{ label: string }>) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50/60 p-4">
      <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900">{children}</dd>
    </div>
  );
}

const formatTH = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleString("th-TH", {
      dateStyle: "medium",
      timeStyle: "short",
    })
    : "—";

// <-- IMPORTANT: accept id prop and type it
type Props = { id: string };

export default function ClientDepartmentDetail({ id }: Props) {
  const [dep, setDep] = useState<Department | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [usersLoading, setUsersLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [usersError, setUsersError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const list = await GetDepartmentsDetailByIdApi(id);
        const item = Array.isArray(list) && list.length > 0 ? list[0] : null;
        if (!mounted) return;
        setDep(item);
      } catch (e: any) {
        console.error("GetDepartmentsDetailByIdApi error", e);
        if (mounted) setError(e?.message ?? "เกิดข้อผิดพลาดในการดึงข้อมูล");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]); // dependency on id prop

  useEffect(() => {
    if (!id) return;

    let mounted = true;
    (async () => {
      setUsersLoading(true);
      setUsersError(null);
      try {
        const userList = await GetUserByDepartmentIdFromApi(id);
        if (!mounted) return;

        // Map API response to UserTable format
        const mapped = (userList || []).map((u: GetUserRespond) => ({
          id: u.id,
          name: u.full_name || `${u.first_name ?? ""} ${u.last_name ?? ""}`.trim(),
          title: u.position ?? "-",
          department_id: u.department_id ?? "-",
          department_name: u.department_name ?? "-",
          status: "Active",
          isActive: typeof u.is_active === "boolean" ? u.is_active : true,
          createdAt: u.last_login_at ?? undefined,
        }));

        setUsers(mapped);
      } catch (e: any) {
        console.error("GetUserByDepartmentIdFromApi error", e);
        if (mounted) setUsersError(e?.message ?? "เกิดข้อผิดพลาดในการดึงข้อมูลพนักงาน");
      } finally {
        if (mounted) setUsersLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [id]);


  if (loading) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-6">
        <div className="bg-white p-6 rounded shadow-sm text-gray-600">กำลังโหลดข้อมูลหน่วยงาน...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-6">
        <div className="bg-white p-6 rounded shadow-sm text-red-600">เกิดข้อผิดพลาด: {error}</div>
      </main>
    );
  }

  if (!dep) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-6">
        <div className="bg-white p-6 rounded shadow-sm text-gray-700">
          ไม่พบหน่วยงาน (ID: {id}). <Link href="/organizer/department" className="text-indigo-600 underline">กลับไปหน้ารายการ</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <nav className="text-sm text-gray-500">
            <Link href="/organizer/department" className="hover:underline">หน่วยงาน</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-700">{dep.name}</span>
          </nav>
          <h1 className="text-xl font-semibold text-gray-900">{dep.name}</h1>
          <p className="text-sm text-gray-600">รหัสหน่วยงาน: <CodeBadge>{dep.code}</CodeBadge></p>
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/organizer/department/${dep.id}/edit`} className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            แก้ไขข้อมูล
          </Link>
        </div>
      </div>

      <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="จำนวนพนักงาน" value={dep.user_count ?? users.length ?? "—"} />
        <StatCard label="จำนวนโปรเจ็กต์" value={dep.project_count ?? "—"} />
        <StatCard label="อัปเดตล่าสุด" value="—" />
      </section>

      <div className="grid  gap-6">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-medium">พนักงาน</h2>
          </div>

          {usersError ? (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700 border border-red-200">
              เกิดข้อผิดพลาด: {usersError}
            </div>
          ) : usersLoading ? (
            <div className="rounded-lg bg-white p-6 text-center text-gray-600">กำลังโหลดพนักงาน...</div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm overflow-auto">
              <table className="min-w-full ">
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
          )}
        </div>

      </div>

    </main>
  );
}
