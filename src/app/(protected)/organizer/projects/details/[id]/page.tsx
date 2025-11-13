
import Link from "next/link";
import {
  formatThaiDateTime,
  formatBaht,
  ProgressBar,
  StatusBadge,
  Section,
  Field,
  Grid2,
  EmptyRow,
} from "@/components/project/Helper";
import type {
  ActivitiesRow,
  ApproveParams,
  BudgetRow,
  BudgetTableValue,
  DateDurationValue,
  EstimateParams,
  ExpectParams,
  GeneralInfoParams,
  GoalParams,
  KPIParams,
  StrategyParams,
} from "@/dto/projectDto";
import { mockProject } from "@/resource/mock-project";

type Project = {
  id: string;

  status: "draft" | "in_progress" | "on_hold" | "done";
  progress: number;
  updatedAt: string;

  generalInfo: GeneralInfoParams;
  strategy: StrategyParams;
  duration: DateDurationValue;
  budget: BudgetTableValue | null;
  activities: ActivitiesRow[];
  kpi: KPIParams;
  estimate: EstimateParams;
  expect: ExpectParams;
  approve: ApproveParams;
  goal: GoalParams;
};

async function getProject(id: string): Promise<Project | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/projects/${id}`,
      { cache: "no-store", headers: { accept: "application/json" } }
    );
    if (!res.ok) throw new Error();

    const data = (await res.json()) as { data?: Project } | Project;
    const item = (
      Array.isArray(data) ? null : (data as any).data ?? data
    ) as Project | null;
    return item ?? mockProject;
  } catch {
    return { ...mockProject, id };
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
            href="/organizer/projects/my-project"
            className="text-indigo-600 hover:underline"
          >
            ← กลับไปยัง My Project
          </Link>
        </div>
      </main>
    );
  }

  const {
    generalInfo,
    strategy,
    duration,
    budget,
    activities,
    kpi,
    estimate,
    expect,
    approve,
    goal,
  } = p;

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <nav className="mb-4 text-xs text-gray-500">
        <Link href="/organizer/projects/my-project" className="hover:underline">
          โปรเจ็กต์ของคุณ
        </Link>
        <span className="mx-1">/</span>
        <span className="text-gray-700">
          {generalInfo?.name || "ไม่ระบุชื่อโครงการ"}
        </span>
      </nav>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            {generalInfo?.name || "ไม่ระบุชื่อโครงการ"}
          </h1>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-600">
            <StatusBadge status={p.status} />
            {generalInfo?.owner ? (
              <>
                <span>
                  เจ้าของ: <b className="text-gray-800">{generalInfo.owner}</b>
                </span>
                <span className="text-gray-400">•</span>
              </>
            ) : null}
            <span>อัปเดตล่าสุด: {formatThaiDateTime(p.updatedAt)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/organizer/projects/edit/${p.id}`}
            className="rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
          >
            แก้ไข
          </Link>
          <Link
            href={`/organizer/projects/approval/${p.id}`}
            className="rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            ส่งอนุมัติ
          </Link>
        </div>
      </div>

      {/* progress */}
      <section className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between text-sm text-gray-700">
          <span>ความคืบหน้า</span>
          <span className="tabular-nums">{p.progress}%</span>
        </div>
        <div className="mt-2">
          <ProgressBar value={p.progress} status={p.status} />
        </div>
      </section>

      {/* General Info */}
      <Section title="ข้อมูลพื้นฐาน">
        <Grid2>
          <Field label="ประเภทโครงการ" value={generalInfo?.type || "—"} />
          <Field
            label="หน่วยงานที่รับผิดชอบ"
            value={generalInfo?.department || "—"}
          />
          <Field
            label="ผู้รับผิดชอบโครงการ"
            value={generalInfo?.owner || "—"}
          />
        </Grid2>
      </Section>

      {/* Goal */}
      <Section title="เป้าหมายของโครงการ">
        <Grid2>
          <Field label="เชิงปริมาณ">
            <p className="text-sm text-gray-800 whitespace-pre-line">
              {goal?.quantityGoal?.trim() || "—"}
            </p>
          </Field>
          <Field label="เชิงคุณภาพ">
            <p className="text-sm text-gray-800 whitespace-pre-line">
              {goal?.qualityGoal?.trim() || "—"}
            </p>
          </Field>
        </Grid2>
      </Section>

      {/* Duration */}
      <Section title="ระยะเวลาดำเนินงาน">
        <Grid2>
          <Field label="วันเริ่มต้น" value={dateOrDash(duration?.startDate)} />
          <Field label="วันสิ้นสุด" value={dateOrDash(duration?.endDate)} />
          <Field
            label="ระยะเวลา (เดือน)"
            value={numOrDash(duration?.durationMonths)}
          />
        </Grid2>
      </Section>

      {/* Strategy */}
      <Section title="ความสอดคล้องเชิงยุทธศาสตร์">
        <Grid2>
          <Field label="แผนยุทธศาสตร์ของสถานศึกษา">
            <RichOrDash text={strategy?.schoolPlan} />
          </Field>
          <Field label="นโยบาย/ยุทธศาสตร์ของ สอศ.">
            <RichOrDash text={strategy?.ovEcPolicy} />
          </Field>
          <Field label="ตัวชี้วัดงานประกันคุณภาพภายใน">
            <RichOrDash text={strategy?.qaIndicator} />
          </Field>
        </Grid2>
      </Section>

      {/* KPI */}
      <Section title="ตัวชี้วัดความสำเร็จ (KPIs)">
        <Grid2>
          <Field label="ผลผลิต (Output)">
            <RichOrDash text={kpi?.output} />
          </Field>
          <Field label="ผลลัพธ์ (Outcome)">
            <RichOrDash text={kpi?.outcome} />
          </Field>
        </Grid2>
      </Section>

      {/* Estimate */}
      <Section title="การติดตามและประเมินผล">
        <Grid2>
          <Field label="วิธีการประเมินผล" value={estimate?.method || "—"} />
          <Field label="ผู้รับผิดชอบ" value={estimate?.evaluator || "—"} />
          <Field label="ระยะเวลา" value={estimate?.period || "—"} />
        </Grid2>
      </Section>

      {/* Expect */}
      <Section title="ผลที่คาดว่าจะได้รับ">
        <RichOrDash text={expect?.result} />
      </Section>

      {/* Budget */}
      <Section title="งบประมาณ">
        {!budget ? (
          <EmptyRow>ยังไม่มีการบันทึกงบประมาณ</EmptyRow>
        ) : (
          <div className="space-y-4">
            <Grid2>
              <Field label="แหล่งงบประมาณ">
                <BudgetSources sources={budget.sources} />
              </Field>
              <Field label="งบประมาณรวม" value={formatBaht(budget.total)} />
            </Grid2>

            <div className="overflow-x-auto rounded border border-gray-200">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-gray-700">
                  <tr>
                    <Th>#</Th>
                    <Th>รายการ</Th>
                    <Th className="text-right">จำนวนเงิน (บาท)</Th>
                    <Th>หมายเหตุ</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {budget.rows?.length ? (
                    budget.rows.map((r) => (
                      <tr key={r.id}>
                        <Td className="px-3 py-2 text-center">{r.id}</Td>
                        <Td className="px-3 py-2">{r.item || "—"}</Td>
                        <Td className="px-3 py-2 text-right">
                          {moneyOrDash(r.amount)}
                        </Td>
                        <Td className="px-3 py-2">{r.note || "—"}</Td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-3 py-3 text-center text-gray-500"
                      >
                        ยังไม่มีรายการงบประมาณ
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Section>

      {/* Activities */}
      <Section title="ขั้นตอนการดำเนินงานกิจกรรม">
        {!activities?.length ? (
          <EmptyRow>ยังไม่มีการบันทึกกิจกรรม</EmptyRow>
        ) : (
          <div className="overflow-x-auto rounded border border-gray-200">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <Th className="w-16">ลำดับ</Th>
                  <Th>กิจกรรม</Th>
                  <Th className="w-56">ระยะเวลา</Th>
                  <Th className="w-64">ผู้รับผิดชอบ</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {activities.map((a) => (
                  <tr key={a.id}>
                    <Td className="px-3 py-2 text-center">{a.id}</Td>
                    <Td className="px-3 py-2">{a.activity || "—"}</Td>
                    <Td className="px-3 py-2">{a.period || "—"}</Td>
                    <Td className="px-3 py-2">{a.owner || "—"}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      {/* Approve */}
      <Section title="การอนุมัติและลงนาม">
        <Grid2>
          <Field label="ผู้เสนอ" value={approve?.proposerName || "—"} />
          <Field label="ตำแหน่ง" value={approve?.proposerPosition || "—"} />
          <Field label="วันที่เสนอ" value={dateOrDash(approve?.proposeDate)} />
          <Field label="ความเห็นหัวหน้างาน/แผนก">
            <RichOrDash text={approve?.deptComment} />
          </Field>
          <Field label="ความเห็นผู้บริหาร/ผู้อำนวยการ">
            <RichOrDash text={approve?.directorComment} />
          </Field>
        </Grid2>
      </Section>
    </main>
  );
}

/* ---------- helpers เฉพาะหน้านี้ ---------- */
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

function Td({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={className}>{children}</td>;
}

function dateOrDash(iso?: string) {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("th-TH", { dateStyle: "medium" });
  } catch {
    return "—";
  }
}

function numOrDash(n?: number) {
  return typeof n === "number" && Number.isFinite(n) ? String(n) : "—";
}

function moneyOrDash(amount: string) {
  const n = parseFloat(amount);
  return Number.isFinite(n)
    ? n.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : "—";
}

function RichOrDash({ text }: { text?: string }) {
  if (!text || !text.trim()) return <span>—</span>;
  return <p className="text-sm text-gray-800 whitespace-pre-line">{text}</p>;
}

function BudgetSources({ sources }: { sources: BudgetTableValue["sources"] }) {
  if (!sources) return <span>—</span>;
  const chips: string[] = [];
  if (sources.school) chips.push("งบสถานศึกษา");
  if (sources.revenue) chips.push("เงินรายได้");
  if (sources.external) {
    chips.push(
      sources.externalAgency?.trim()
        ? `ภายนอก (${sources.externalAgency.trim()})`
        : "ภายนอก"
    );
  }
  return chips.length ? (
    <div className="flex flex-wrap gap-1">
      {chips.map((c) => (
        <span
          key={c}
          className="inline-flex items-center rounded bg-gray-100 px-2 py-0.5 text-[11px]"
        >
          {c}
        </span>
      ))}
    </div>
  ) : (
    <span>—</span>
  );
}
