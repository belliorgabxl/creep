import { Project } from "@/dto/projectDto";
import Link from "next/link";

export function ProjectTable({ projects }: { projects: Project[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="min-w-[1000px] w-full border-collapse text-sm">
        <thead className="bg-gray-50 text-left text-gray-700">
          <tr>
            <Th>โครงการ</Th>
            <Th>ประเภท / หน่วยงาน</Th>
            <Th className="w-56">ความคืบหน้า</Th>
            <Th className="w-20 text-center">KPI</Th>
            <Th>QA Indicators</Th>
            <Th>ยุทธศาสตร์</Th>
            <Th className="w-28 text-right">งบประมาณ</Th>
            <Th className="w-20 text-center">ไฟล์</Th>
            <Th className="w-40">อัปเดตล่าสุด</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {projects.map((p) => {
            const kpiCount = p.kpis?.length ?? 0;
            const qaCount = p.qaIndicators?.length ?? 0;
            const stratCount = p.strategies?.length ?? 0;
            const fileCount = p.attachmentsCount ?? 0;

            return (
              <tr key={p.id} className="hover:bg-gray-50/60">
                <Td>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link
                        href={`/user/projects/details/${p.id}`}
                        className="font-medium text-gray-900 hover:underline line-clamp-1"
                      >
                        {p.name}
                      </Link>
                      {p.objective ? (
                        <p className="mt-1 text-xs text-gray-600 line-clamp-2">
                          {p.objective}
                        </p>
                      ) : null}
                    </div>
                    <StatusBadge status={p.status} />
                  </div>
                </Td>

                <Td>
                  <div className="flex flex-wrap items-center gap-1">
                    {p.type && <BadgeTiny>{p.type}</BadgeTiny>}
                    {p.department && <BadgeTiny>{p.department}</BadgeTiny>}
                    {p.durationMonths ? (
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[11px]">
                        ระยะเวลา {p.durationMonths} เดือน
                      </span>
                    ) : null}
                  </div>
                </Td>

                <Td>
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>ความคืบหน้า</span>
                    <span className="tabular-nums">{(p.progress ?? 0)}%</span>
                  </div>
                  <div className="mt-1">
                    <ProgressBar value={p.progress ?? 0} status={p.status} />
                  </div>
                </Td>

                <Td className="text-center tabular-nums">
                  {kpiCount > 0 ? kpiCount : "—"}
                </Td>

                <Td>
                  {qaCount > 0 ? chipList(p.qaIndicators!, 2) : "—"}
                </Td>

                <Td>
                  {stratCount > 0 ? chipList(p.strategies!, 2) : "—"}
                </Td>

                <Td className="text-right">
                  {p.budget != null ? formatBaht(p.budget) : "—"}
                </Td>

                <Td className="text-center tabular-nums">
                  {fileCount > 0 ? fileCount : "—"}
                </Td>

                <Td>{formatThaiDateTime(p.updatedAt)}</Td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
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
    <th className={`px-3 py-2 text-xs font-semibold ${className}`}>{children}</th>
  );
}

function Td({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={`px-3 py-3 align-top ${className}`}>{children}</td>;
}

function StatusBadge({ status }: { status: Project["status"] }) {
  const map: Record<Project["status"], string> = {
    draft: "bg-gray-100 text-gray-700",
    in_progress: "bg-blue-100 text-blue-800",
    on_hold: "bg-amber-100 text-amber-800",
    done: "bg-green-100 text-green-800",
  };
  const label: Record<Project["status"], string> = {
    draft: "ฉบับร่าง",
    in_progress: "กำลังดำเนินการ",
    on_hold: "พักไว้",
    done: "เสร็จสิ้น",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${map[status]}`}
      title={label[status]}
    >
      {label[status]}
    </span>
  );
}

function ProgressBar({
  value,
  status,
}: {
  value: number;
  status: Project["status"];
}) {
  const v = Math.max(0, Math.min(100, value));
  const color =
    status === "done"
      ? "bg-green-600"
      : status === "on_hold"
      ? "bg-amber-600"
      : status === "in_progress"
      ? "bg-blue-600"
      : "bg-gray-800";
  return (
    <div className="h-2 w-full rounded-full bg-gray-200">
      <div
        className={`h-2 rounded-full transition-[width] ${color}`}
        style={{ width: `${v}%` }}
      />
    </div>
  );
}

function BadgeTiny({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[11px]">
      {children}
    </span>
  );
}

function chipList(list: string[], max = 2) {
  const more = list.length - max;
  const shown = list.slice(0, max);
  return (
    <span className="flex flex-wrap items-center gap-1">
      {shown.map((t) => (
        <span
          key={t}
          className="inline-flex items-center rounded bg-gray-100 px-1.5 py-0.5"
        >
          {t}
        </span>
      ))}
      {more > 0 && <span className="text-gray-500">+{more}</span>}
    </span>
  );
}

function formatBaht(n: number) {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0,
  }).format(n);
}

function formatThaiDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("th-TH", { dateStyle: "medium", timeStyle: "short" });
}
