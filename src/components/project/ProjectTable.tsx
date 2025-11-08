import { Project } from "@/dto/projectDto";
import Link from "next/link";
import * as React from "react";
import {
  BadgeTiny,
  formatBaht,
  formatThaiDateTime,
  ProgressBar,
  StatusBadge,
  Td,
} from "./Helper";

export function ProjectTable({ projects }: { projects: Project[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full border-collapse text-sm">
        <colgroup>
          <col style={{ width: "36%" }} />
          <col style={{ width: "18%" }} />
          <col style={{ width: "12%" }} />
          <col style={{ width: "16%" }} />
          <col style={{ width: "10%" }} />
          <col style={{ width: "8%" }} />
        </colgroup>

        <thead className="bg-gray-50 text-left text-gray-700">
          <tr>
            <Th>โครงการ</Th>
            <Th className="hidden sm:table-cell">หน่วยงาน / ประเภท</Th>
            <Th>สถานะ</Th>
            <Th>ความคืบหน้า</Th>
            <Th className="text-right">งบประมาณ</Th>
            <Th>อัปเดตล่าสุด</Th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {projects.map((p) => (
            <tr key={p.id} className="hover:bg-gray-50/60">
              <Td>
                <div className="min-w-0">
                  <Link
                    href={`/user/projects/details/${p.id}`}
                    className="font-medium text-gray-900 hover:underline line-clamp-1"
                    title={p.name}
                  >
                    {p.name}
                  </Link>
                  {p.objective ? (
                    <p
                      className="mt-1 text-xs text-gray-600 line-clamp-1"
                      title={p.objective}
                    >
                      {p.objective}
                    </p>
                  ) : null}
                </div>
              </Td>
              <Td className="hidden sm:table-cell">
                <div className="flex flex-wrap items-center gap-1">
                  {p.department && (
                    <BadgeTiny title={p.department}>
                      <span className="line-clamp-1">{p.department}</span>
                    </BadgeTiny>
                  )}
                  {p.type && (
                    <BadgeTiny title={p.type}>
                      <span className="line-clamp-1">{p.type}</span>
                    </BadgeTiny>
                  )}
                  {p.durationMonths ? (
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[11px]">
                      ระยะเวลา {p.durationMonths} เดือน
                    </span>
                  ) : null}
                </div>
              </Td>

              <Td>
                <StatusBadge status={p.status} />
              </Td>

              <Td>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <ProgressBar value={p.progress ?? 0} status={p.status} />
                  </div>
                  <span className="w-10 text-right tabular-nums">
                    {p.progress ?? 0}%
                  </span>
                </div>
              </Td>

              <Td className="text-right">
                {p.budget != null ? formatBaht(p.budget) : "—"}
              </Td>
              <Td title={p.updatedAt}>
                <span className="line-clamp-1">
                  {formatThaiDateTime(p.updatedAt)}
                </span>
              </Td>
            </tr>
          ))}
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
    <th className={`px-3 py-2 text-xs font-semibold ${className}`}>
      {children}
    </th>
  );
}
