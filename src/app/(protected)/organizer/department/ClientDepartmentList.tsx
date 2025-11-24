"use client";

import React, { useEffect, useState } from "react";
import { DepartmentTable } from "@/components/department/DepartmentTable";
import { fetchDepartments } from "@/api/department/route";
import { Department } from "@/dto/departmentDto";

export default function ClientDepartmentList() {
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
        setDepartments(list);
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

  if (loading) {
    return <div className="p-6 bg-white rounded">กำลังโหลดหน่วยงาน...</div>;
  }

  if (error) {
    return <div className="p-6 bg-white rounded text-red-600">เกิดข้อผิดพลาด: {error}</div>;
  }

  return <DepartmentTable data={departments} />;
}
