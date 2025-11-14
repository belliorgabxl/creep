"use client";

import { EmptyState } from "@/components/project/EmptyState";
import { Stat } from "@/components/project/Helper";
import { LoadData } from "@/components/project/LoadData";
import { ProjectTable } from "@/components/project/ProjectTable";
import { Project } from "@/dto/projectDto";
import { mockProjects } from "@/resource/mock-data";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

async function getMyProjects(): Promise<Project[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/projects/my`,
      {
        cache: "no-store",
        headers: { accept: "application/json" },
      }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as { data?: Project[] } | Project[];
    const list = Array.isArray(data) ? data : data.data ?? [];

    if (!list.length) {
      console.log("ใช้ mock data แทน (ไม่มีข้อมูลจริงจาก API)");
      return mockProjects;
    }

    return list
      .filter((p) => (p.role ?? "viewer") !== "viewer")
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
  } catch (err) {
    console.warn("ใช้ mock data เนื่องจาก API ล้มเหลว:", err);
    return mockProjects;
  }
}

export default function Page() {
  const [projects, setProject] = useState<Project[]>([]);
  const hasProjects = projects.length > 0;
  const [fetchDataLoader, setFetchDataLoader] = useState<boolean>(false);

  const mockData = async () => {
    setFetchDataLoader(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const response = await getMyProjects();
    setProject(response);
    setFetchDataLoader(false);
  };
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
          {/* <Link
            href="/user/projects"
            className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
          >
            ดูทั้งหมด
          </Link> */}
          <button
            className="px-5 py-1 rounded-md border border-gray-300 "
            onClick={() => {
              mockData();
            }}
          >
            ทดลองข้อมูล
          </button>
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
                <Stat
                  title="กำลังดำเนินการ"
                  value={
                    projects.filter((p) => p.status === "in_progress").length
                  }
                />
                <Stat
                  title="เสร็จสิ้น"
                  value={projects.filter((p) => p.status === "done").length}
                />
                <Stat
                  title="พักไว้"
                  value={projects.filter((p) => p.status === "on_hold").length}
                />
              </section>
              <section>
                <ProjectTable projects={projects.slice(0, 100)} />
              </section>
            </>
          )}
        </>
      )}
    </main>
  );
}
