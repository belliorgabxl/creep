"use client";
import {
  chipList,
  EmptyRow,
  Field,
  formatBaht,
  formatThaiDateTime,
  Grid2,
  ProgressBar,
  Section,
  StatusBadge,
} from "@/components/project/Helper";
import { Project } from "@/dto/projectDto";
import { mockOne } from "@/resource/mock-data";
import Link from "next/link";

async function getProject(id: string): Promise<Project | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/projects/${id}`,
      {
        cache: "no-store",
        headers: { accept: "application/json" },
      }
    );
    if (!res.ok) throw new Error();
    const data = (await res.json()) as { data?: Project } | Project;
    const item = Array.isArray(data) ? null : (data as any).data ?? data;
    return (item as Project) ?? null;
  } catch {
    return { ...mockOne, id };
  }
}

type PageParams = Promise<{ id: string }>;

export default async function Page({ params }: { params: PageParams }) {
  const { id } = await params;
  const p = await getProject(id);

  if (!p) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-xl font-semibold text-gray-900">ไม่พบโปรเจ็กต์</h1>
        <p className="text-sm text-gray-600 mt-2">
          โปรเจ็กต์อาจถูกลบหรือคุณไม่มีสิทธิ์เข้าถึง
        </p>
        <div className="mt-6">
          <Link
            href="/user/my-project"
            className="text-indigo-600 hover:underline"
          >
            ← กลับไปยัง My Project
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <nav className="mb-4 text-xs text-gray-500">
        <Link href="/user/my-project" className="hover:underline">
          โปรเจ็คของคุณ
        </Link>
        <span className="mx-1">/</span>
        <span className="text-gray-700">{p.name}</span>
      </nav>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">{p.name}</h1>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-600">
            <StatusBadge status={p.status} />
            <span>
              เจ้าของ: <b className="text-gray-800">{p.owner}</b>
            </span>
            <span className="text-gray-400">•</span>
            <span>อัปเดตล่าสุด: {formatThaiDateTime(p.updatedAt)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/user/projects/edit/${p.id}`}
            className="rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
          >
            แก้ไข
          </Link>
          <Link
            href={`/user/projects/approval/${p.id}`}
            className="rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            ส่งอนุมัติ
          </Link>
        </div>
      </div>
      <section className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between text-sm text-gray-700">
          <span>ความคืบหน้า</span>
          <span className="tabular-nums">{p.progress}%</span>
        </div>
        <div className="mt-2">
          <ProgressBar value={p.progress} status={p.status} />
        </div>
      </section>
      <Section title="ข้อมูลพื้นฐาน">
        <Grid2>
          <Field label="ประเภทโครงการ" value={p.type ?? "—"} />
          <Field label="หน่วยงานที่รับผิดชอบ" value={p.department ?? "—"} />
          <Field
            label="ระยะเวลาโครงการ"
            value={p.durationMonths ? `${p.durationMonths} เดือน` : "—"}
          />
        </Grid2>
      </Section>
      <Section title="วัตถุประสงค์ / เป้าหมาย">
        <p className="text-sm text-gray-800">{p.objective ?? "—"}</p>
      </Section>
      <Section title="ตัวชี้วัดความสำเร็จ (KPI)">
        {!p.kpis?.length ? (
          <EmptyRow>ยังไม่ได้ระบุ KPI</EmptyRow>
        ) : (
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-800">
            {p.kpis!.map((k, i) => (
              <li key={i} className="flex items-center justify-between gap-2">
                <span>{k.name}</span>
                <span className="text-gray-600">
                  {k.target != null ? `เป้าหมาย ${k.target}` : ""}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title="งบประมาณที่ขอ">
        <p className="text-sm text-gray-800">
          {p.budget != null ? formatBaht(p.budget) : "—"}
        </p>
      </Section>

      <Section title="QA & Strategy Alignment">
        <Grid2>
          <Field label="QA Indicators">{chipList(p.qaIndicators)}</Field>
          <Field label="แผนยุทธศาสตร์">{chipList(p.strategies)}</Field>
        </Grid2>
      </Section>
      <Section title="ไฟล์แนบ">
        <p className="text-sm text-gray-800">
          {p.attachmentsCount ? `${p.attachmentsCount} ไฟล์` : "—"}
        </p>
      </Section>
    </main>
  );
}
