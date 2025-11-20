"use client";

import Link from "next/link";
import * as React from "react";
import { Department } from "@/dto/projectDto";

// ----- UI primitives (Table components) -----
function Table({
  children,
  className = "",
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className={`min-w-full text-sm ${className}`}>{children}</table>
    </div>
  );
}

function THead(props: React.HTMLAttributes<HTMLTableSectionElement>) {
  const { children, className = "", ...rest } = props;
  return (
    <thead className={`sticky top-0 z-10 ${className}`} {...rest}>
      <tr className="bg-gradient-to-r from-indigo-50/70 to-blue-50/70">
        {children}
      </tr>
    </thead>
  );
}

function TH(
  props: React.PropsWithChildren<
    { align?: "left" | "right" | "center"; className?: string } & React.ThHTMLAttributes<HTMLTableCellElement>
  >
) {
  const { children, align = "left", className = "", ...rest } = props;
  const alignCls =
    align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left";
  return (
    <th
      scope="col"
      className={`px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-700 ${alignCls} ${className}`}
      {...rest}
    >
      {children}
    </th>
  );
}

function TBody(props: React.HTMLAttributes<HTMLTableSectionElement>) {
  const { children, className = "", ...rest } = props;
  return (
    <tbody className={`divide-y divide-gray-100 ${className}`} {...rest}>
      {children}
    </tbody>
  );
}

function TR(props: React.HTMLAttributes<HTMLTableRowElement>) {
  const { children, className = "", ...rest } = props;
  return (
    <tr
      className={`odd:bg-white even:bg-gray-50/40 hover:bg-indigo-50/40 transition-colors ${className}`}
      {...rest}
    >
      {children}
    </tr>
  );
}

function TD(
  props: React.PropsWithChildren<
    { align?: "left" | "right" | "center"; className?: string } & React.TdHTMLAttributes<HTMLTableCellElement>
  >
) {
  const { children, align = "left", className = "", ...rest } = props;
  const alignCls =
    align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left";
  return (
    <td className={`px-4 py-3 text-gray-800 ${alignCls} ${className}`} {...rest}>
      {children}
    </td>
  );
}

// ----- Small UI atoms -----
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

const formatTH = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString("th-TH") : "—";

// ----- Department Table (reusable) -----
export function DepartmentTable({ data }: { data: Department[] }) {
  return (
    <Table>
      <THead>
        <TH>รหัส</TH>
        <TH>ชื่อหน่วยงาน</TH>
        <TH>หัวหน้าหน่วยงาน</TH>
        <TH align="right">พนักงาน</TH>
        <TH align="right">โปรเจ็กต์</TH>
        <TH>อัปเดตล่าสุด</TH>
        <TH align="right">การกระทำ</TH>
      </THead>
      <TBody>
        {data.length === 0 ? (
          <TR>
            <TD align="center" className="py-8" colSpan={7}>
              <Muted>ยังไม่มีหน่วยงาน</Muted>
            </TD>
          </TR>
        ) : (
          data.map((d) => (
            <TR key={d.id}>
              <TD>{d.code ? <CodeBadge>{d.code}</CodeBadge> : <Muted>—</Muted>}</TD>
              <TD>
                <Link
                  href={`/user/department/${d.id}`}
                  className="font-medium text-gray-900 hover:underline underline-offset-2"
                >
                  {d.name}
                </Link>
              </TD>
              <TD>{d.head ?? <Muted>—</Muted>}</TD>
              <TD align="right" className="tabular-nums">
                {d.employees ?? <Muted>—</Muted>}
              </TD>
              <TD align="right" className="tabular-nums">
                {d.projectsCount != null ? d.projectsCount : <Muted>—</Muted>}
              </TD>
              <TD>{formatTH(d.updatedAt)}</TD>
              <TD align="right">
                <Link
                  href={`/organizer/department/${d.id}`}
                  className="inline-flex items-center rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                >
                  ดูรายละเอียด
                </Link>
              </TD>
            </TR>
          ))
        )}
      </TBody>
    </Table>
  );
}
