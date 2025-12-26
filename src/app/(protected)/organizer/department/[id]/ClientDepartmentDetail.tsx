// src/app/(protected)/organizer/department/[id]/ClientDepartmentDetail.tsx
"use client";

import React, { useEffect, useState } from "react";
import { GetDepartmentsDetailByIdFromApi } from "@/api/department"; // client-side wrapper that calls /api/department/detail/:id
import type { Department } from "@/dto/departmentDto";
import Link from "next/link";

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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const list = await GetDepartmentsDetailByIdFromApi(id);
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
        <StatCard label="จำนวนพนักงาน" value={dep.user_count ?? "—"} />
        <StatCard label="จำนวนโปรเจ็กต์" value={dep.project_count ?? "—"} />
        <StatCard label="อัปเดตล่าสุด" value={formatTH((dep as any).updatedAt)} />
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-gray-900">ข้อมูลหน่วยงาน</h2>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <DetailItem label="รหัส"><CodeBadge>{dep.code}</CodeBadge></DetailItem>
          <DetailItem label="ชื่อหน่วยงาน">{dep.name}</DetailItem>
          <DetailItem label="จำนวนพนักงาน">{dep.user_count != null ? <span className="tabular-nums text-gray-900">{dep.user_count}</span> : <Muted>—</Muted>}</DetailItem>
          <DetailItem label="จำนวนโปรเจ็กต์">{dep.project_count != null ? <span className="tabular-nums text-gray-900">{dep.project_count}</span> : <Muted>—</Muted>}</DetailItem>
          <DetailItem label="อัปเดตล่าสุด">{formatTH((dep as any).updatedAt)}</DetailItem>
        </dl>
      </section>
    </main>
  );
}
