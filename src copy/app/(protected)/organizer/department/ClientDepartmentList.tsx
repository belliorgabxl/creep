"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DepartmentTable } from "@/components/department/DepartmentTable";
import { fetchDepartments } from "@/api/department/route";
import { Department } from "@/dto/departmentDto";

export default function ClientDepartmentList() {
  const router = useRouter();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const list = await fetchDepartments();
        if (!mounted) return;
        setDepartments(list ?? []);
        setError(null);
      } catch (e: any) {
        console.error("fetchDepartments failed", e);
        if (mounted) setError(e?.message ?? "Failed to load departments");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleDetails = (d: Department) => {
    if (!d?.id) return;
    router.push(`/organizer/department/${d.id}`);
  };

  return (
    <div>
      {error && (
        <div className="mb-4 rounded bg-rose-50 px-4 py-3 text-sm text-rose-700 border border-rose-100">
          เกิดข้อผิดพลาด: {error}
        </div>
      )}

      <DepartmentTable
        data={departments}
        loading={loading}
        skeletonRows={6}
        itemsPerPage={10}
        onDetails={handleDetails}
      />
    </div>
  );
}
