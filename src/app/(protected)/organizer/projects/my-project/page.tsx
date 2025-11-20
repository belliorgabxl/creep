"use client";

import { EmptyState } from "@/components/project/EmptyState";
import { Stat } from "@/components/project/Helper";
import { LoadData } from "@/components/project/LoadData";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import type { GetProjectsByOrgRespond } from "@/dto/dashboardDto";
import { GetProjectsByOrgFromApi } from "@/api/dashboard/route";
import { ExportPDFDocument } from "@/components/button/ExportProjectButton";

export default function Page() {
  const [projects, setProjects] = useState<GetProjectsByOrgRespond[]>([]);
  const [fetchDataLoader, setFetchDataLoader] = useState<boolean>(false);

  const hasProjects = projects.length > 0;

  useEffect(() => {
    let cancelled = false;

    const loadProjects = async () => {
      try {
        setFetchDataLoader(true);
        const apiProjects = await GetProjectsByOrgFromApi();
        if (cancelled) return;
        setProjects(apiProjects ?? []);
      } catch (err) {
        console.error("[Page] loadProjects error:", err);
        if (!cancelled) setProjects([]);
      } finally {
        if (!cancelled) setFetchDataLoader(false);
      }
    };

    loadProjects();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="mx-auto grid lg:px-18 md:px-10 sm:px-5 px-4 py-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            โปรเจ็คทั้งหมด
          </h1>
          <p className="text-sm text-gray-600">
            แสดงเฉพาะโปรเจ็กต์ที่คุณเป็นเจ้าของหรือผู้รับผิดชอบ
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/organizer/projects/new"
            className="inline-flex items-center duration-400 gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-[102%] px-3.5 py-2 text-sm font-medium text-white hover:bg-black"
          >
            <div className="p-0.5 border-2 border-white rounded-full">
              <Plus className="h-4 w-4 text-white " />
            </div>
            เพิ่มโปรเจ็คใหม่
          </Link>
        </div>
      </div>

      {fetchDataLoader ? (
        <LoadData />
      ) : (
        <>
          {!hasProjects ? (
            <EmptyState />
          ) : (
            <>
              <section className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Stat title="โปรเจ็กต์ของฉัน" value={projects.length} />
              </section>
              <section className="relative -mx-4 sm:mx-0">
                <div className="max-h-[70vh] overflow-x-auto overflow-y-auto rounded border border-gray-200 bg-white">
                  <table className="min-w-[900px] w-full text-sm">
                    <thead className="bg-gray-50 text-gray-700">
                      <tr>
                        <Th className="w-10 text-center">#</Th>
                        <Th>ชื่อโครงการ</Th>
                        <Th className="w-32">รหัสโครงการ</Th>
                        <Th className="w-40">หน่วยงาน (department_id)</Th>
                        <Th className="w-48">ระยะเวลา</Th>
                        <Th className="w-40">สถานที่</Th>
                        <Th className="w-40 text-center">จัดการ</Th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {projects.map((p, idx) => (
                        <tr key={p.id}>
                          <Td className="text-center">{idx + 1}</Td>
                          <Td>
                            <div className="flex flex-col">
                              <span className="font-medium text-gray-900">
                                {p.name || "ไม่ระบุชื่อโครงการ"}
                              </span>
                              {p.rationale ? (
                                <span className="text-xs text-gray-500 line-clamp-1">
                                  {p.rationale}
                                </span>
                              ) : null}
                            </div>
                          </Td>
                          <Td className="text-gray-700">{p.code || "—"}</Td>
                          <Td className="text-gray-700 text-xs">
                            {p.department_id ? p.department_id.slice(0, 10)+"....." : "—"}
                          </Td>
                          <Td className="text-gray-700 text-xs">
                            {renderDateRange(p.start_date, p.end_date)}
                          </Td>
                          <Td className="text-gray-700">{p.location || "—"}</Td>
                          <Td className="text-gray-700 ">
                            <ExportPDFDocument id={p.id} />
                          </Td>
                          <Td className="text-center">
                            <div className="flex flex-col items-center gap-1">
                              <Link
                                href={`/organizer/projects/details/${p.id}`}
                                className="inline-flex items-center rounded-md border border-gray-300 px-2 py-1 text-xs text-gray-800 hover:bg-gray-50"
                              >
                                ดูรายละเอียด
                              </Link>
                            </div>
                          </Td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}
        </>
      )}
    </main>
  );
}

function Th({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={`px-3 py-2 text-xs font-semibold text-left text-gray-700 ${className}`}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={className}>{children}</td>;
}

function renderDateRange(start?: string | Date, end?: string | Date): string {
  const fmt = (d?: string | Date) => {
    if (!d) return "";
    const iso = typeof d === "string" ? d : d.toString();
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString("th-TH", { dateStyle: "medium" });
  };

  const s = fmt(start);
  const e = fmt(end);

  if (!s && !e) return "—";
  if (s && !e) return s;
  if (!s && e) return e;
  return `${s} - ${e}`;
}
