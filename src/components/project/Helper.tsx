import { Project, TdProps } from "@/dto/projectDto";

export function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <h2 className="mb-2 text-sm font-semibold text-gray-900">{title}</h2>
      {children}
    </section>
  );
}
export function Grid2({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">{children}</div>
  );
}
export function Field({
  label,
  value,
  children,
}: {
  label: string;
  value?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="text-sm">
      <div className="text-gray-500">{label}</div>
      <div className="mt-0.5 text-gray-900">{children ?? value ?? "—"}</div>
    </div>
  );
}
export function EmptyRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-600">
      {children}
    </div>
  );
}
export function StatusBadge({ status }: { status: Project["status"] }) {
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
    >
      {label[status]}
    </span>
  );
}
export function ProgressBar({
  value,
  status,
}: {
  value: number;
  status: Project["status"];
}) {
  const v = Math.max(0, Math.min(100, value ?? 0));
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

export function chipList(list?: string[]) {
  if (!list?.length) return <span className="text-gray-500">—</span>;
  return (
    <div className="flex flex-wrap gap-2">
      {list.map((t) => (
        <span
          key={t}
          className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-800"
        >
          {t}
        </span>
      ))}
    </div>
  );
}
export function formatBaht(n: number) {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0,
  }).format(n);
}
export function formatThaiDateTime(iso: string) {
  return new Date(iso).toLocaleString("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}



export function Td({ children, className = "", ...rest }: TdProps) {
  return (
    <td
      {...rest}
      className={`px-3 py-3 align-top min-w-0 overflow-hidden ${className}`}
    >
      {children}
    </td>
  );
}

export function BadgeTiny({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <span
      className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[11px] max-w-[12rem] overflow-hidden"
      title={title}
    >
      <span className="line-clamp-1">{children}</span>
    </span>
  );
}

export function BadgeCreateFormProject({ title }: { title: string }) {
  return (
    <h1 className="px-4 py-1 text-white bg-gradient-to-r from-blue-600 to-indigo-500 rounded-md w-fit ">
      {title}
    </h1>
  );
}

export function Stat({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-lg">
      <div className="text-sm text-gray-600">{title}</div>
      <div className="mt-1 text-2xl font-semibold tabular-nums text-gray-900">
        {value}
      </div>
    </div>
  );
}
