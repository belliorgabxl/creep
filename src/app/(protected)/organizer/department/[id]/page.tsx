import { Department } from "@/dto/projectDto";
import { mockDepartments } from "@/resource/mock-data";
import Link from "next/link";
import { notFound } from "next/navigation";

async function getDepartment(id: string): Promise<Department | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/departments/${id}`,
      { cache: "no-store", headers: { accept: "application/json" } }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as { data?: Department } | Department;
    const dep = "data" in data ? data.data ?? null : (data as Department);
    if (dep) return dep;

    const fallback = mockDepartments.find((d) => d.id === id) ?? null;
    return fallback;
  } catch {
    return mockDepartments.find((d) => d.id === id) ?? null;
  }
}

const formatTH = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleString("th-TH", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "—";

export default async function DepartmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const dep = await getDepartment(id);
  if (!dep) notFound();

  return (
    <main className="mx-auto max-w-5xl px-4 py-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <nav className="text-sm text-gray-500">
            <Link href="/user/department" className="hover:underline">
              หน่วยงาน
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-700">{dep.name}</span>
          </nav>
          <h1 className="text-xl font-semibold text-gray-900">{dep.name}</h1>
          <p className="text-sm text-gray-600">
            รหัสหน่วยงาน: <CodeBadge>{dep.code}</CodeBadge>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/user/department/${dep.id}/edit`}
            className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            แก้ไขข้อมูล
          </Link>
          {/* <Link
            href="/user/department"
            className="inline-flex items-center rounded-lg bg-gradient-to-r from-indigo-500 to-blue-700 px-3.5 py-2 text-sm font-medium text-white hover:bg-black"
          >
            กลับไปหน้ารายการ
          </Link> */}
        </div>
      </div>

      <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="จำนวนพนักงาน" value={dep.employees ?? "—"} />
        <StatCard label="จำนวนโปรเจ็กต์" value={dep.projectsCount ?? "—"} />
        <StatCard label="อัปเดตล่าสุด" value={formatTH(dep.updatedAt)} />
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-gray-900">
          ข้อมูลหน่วยงาน
        </h2>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <DetailItem label="รหัส">
            <CodeBadge>{dep.code}</CodeBadge>
          </DetailItem>

          <DetailItem label="ชื่อหน่วยงาน">{dep.name}</DetailItem>

          <DetailItem label="หัวหน้าหน่วยงาน">
            {dep.head ? (
              <span className="text-gray-900">{dep.head}</span>
            ) : (
              <Muted>—</Muted>
            )}
          </DetailItem>

          <DetailItem label="จำนวนพนักงาน">
            {dep.employees != null ? (
              <span className="tabular-nums text-gray-900">
                {dep.employees}
              </span>
            ) : (
              <Muted>—</Muted>
            )}
          </DetailItem>

          <DetailItem label="จำนวนโปรเจ็กต์">
            {dep.projectsCount != null ? (
              <span className="tabular-nums text-gray-900">
                {dep.projectsCount}
              </span>
            ) : (
              <Muted>—</Muted>
            )}
          </DetailItem>

          <DetailItem label="อัปเดตล่าสุด">
            {formatTH(dep.updatedAt)}
          </DetailItem>
        </dl>
      </section>
    </main>
  );
}

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
      <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </div>
      <div className="mt-1 text-lg font-semibold text-gray-900 tabular-nums">
        {value}
      </div>
    </div>
  );
}

function DetailItem({
  label,
  children,
}: React.PropsWithChildren<{ label: string }>) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50/60 p-4">
      <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-gray-900">{children}</dd>
    </div>
  );
}
