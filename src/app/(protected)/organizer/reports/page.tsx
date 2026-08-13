"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  FileText,
  Loader2,
  ChevronDown,
  ShieldCheck,
  Banknote,
  Download,
  AlertCircle,
} from "lucide-react";
import BackGroundLight from "@/components/background/bg-light";
import { buildReportHTML, printHTML } from "@/lib/pdf-generator";
import {
  buildQA_ProjectPlanReport,
  buildQA_BudgetByStandardReport,
  buildQA_BudgetByIndicatorReport,
  buildQA_BudgetByStrategyReport,
  buildQA_BudgetByDepartmentReport,
  buildQA_OrgBudgetSummaryReport,
  buildExp_OrgBudgetReport,
  buildExp_BudgetByDeptApprovalReport,
  buildExp_ProjectOpenReport,
  buildExp_ProjectClosureReport,
} from "@/lib/report-builders";
import type { GetProjectsByOrgRespond } from "@/dto/dashboardDto";
import type { BudgetByDepartment } from "@/dto/dashboardDto";

/* ── Types ─────────────────────────────────────────────── */
type ReportId =
  | "qa_project_plan"
  | "qa_budget_standard"
  | "qa_budget_indicator"
  | "qa_budget_strategy"
  | "qa_budget_dept"
  | "qa_budget_org"
  | "exp_org_budget"
  | "exp_dept_approval"
  | "exp_dept_inner"
  | "exp_open_org"
  | "exp_open_dept"
  | "exp_close_dept"
  | "exp_close_org";

interface ReportDef {
  id: ReportId;
  title: string;
  subtitle: string;
  group: "qa" | "exp";
}

/* ── Report Definitions ─────────────────────────────────── */
const QA_REPORTS: ReportDef[] = [
  { id: "qa_project_plan", title: "รายงานสรุปแผนการดำเนินงานโครงการ/แผนงานประจำปี", subtitle: "แสดงรายละเอียดโครงการและแผนงานที่วางแผนไว้ในปีงบประมาณ", group: "qa" },
  { id: "qa_budget_standard", title: "รายงานสรุปแผนงบประมาณแยกประเภทตามมาตรฐาน", subtitle: "แยกตามประเภทโครงการ: โครงการทั่วไป / แผนงานประจำ", group: "qa" },
  { id: "qa_budget_indicator", title: "รายงานสรุปแผนงบประมาณแยกประเภทตามตัวบ่งชี้", subtitle: "แสดงการกระจายงบประมาณตามตัวบ่งชี้การประกันคุณภาพ (QA)", group: "qa" },
  { id: "qa_budget_strategy", title: "รายงานสรุปแผนงบประมาณแยกตามแผนยุทธศาสตร์", subtitle: "แสดงสัดส่วนงบประมาณตามแผนยุทธศาสตร์ขององค์กร", group: "qa" },
  { id: "qa_budget_dept", title: "รายงานสรุปแผนงบประมาณแยกตามแผนกหรือฝ่ายงาน", subtitle: "แสดงงบประมาณที่ได้รับและใช้จริงของแต่ละแผนก", group: "qa" },
  { id: "qa_budget_org", title: "รายงานสรุปแผนงบประมาณภาพรวมองค์กร", subtitle: "สรุปภาพรวมงบประมาณทั้งองค์กรในปีงบประมาณ", group: "qa" },
];

const EXP_REPORTS: ReportDef[] = [
  { id: "exp_org_budget", title: "รายงานสรุปแผนงบประมาณรายจ่ายประจำปี ภาพรวมทั้งองค์กร", subtitle: "สรุปงบประมาณรายจ่ายที่ได้รับอนุมัติและไม่อนุมัติทั้งองค์กร", group: "exp" },
  { id: "exp_dept_approval", title: "รายงานสรุปแผนงบประมาณรายจ่ายประจำปี แยกรายแผน/ฝ่ายงาน ที่ได้รับอนุมัติ/ไม่อนุมัติ", subtitle: "แสดงรายการที่ได้รับ/ไม่ได้รับอนุมัติ แยกตามแผนก", group: "exp" },
  { id: "exp_dept_inner", title: "รายงานงบประมาณรายจ่ายประจำปี ภายในแผนก/ฝ่ายงาน ที่ได้รับอนุมัติ/ไม่อนุมัติ", subtitle: "รายละเอียดงบประมาณภายในแผนก ที่ได้รับ/ไม่ได้รับอนุมัติ", group: "exp" },
  { id: "exp_open_org", title: "รายงานการดำเนินงานเปิดโครงการ ภาพรวมทั้งองค์กร", subtitle: "สรุปโครงการที่กำลังดำเนินงานอยู่ทั้งองค์กร", group: "exp" },
  { id: "exp_open_dept", title: "รายงานการดำเนินงานเปิดโครงการ รายแผน/ฝ่ายงาน", subtitle: "แสดงโครงการที่ดำเนินงานอยู่ แยกตามแผนก", group: "exp" },
  { id: "exp_close_dept", title: "รายงานการอนุมัติ/ไม่อนุมัติ ปิดโครงการ รายแผนก/ฝ่ายงาน", subtitle: "แสดงสถานะการปิดโครงการแยกตามแผนก", group: "exp" },
  { id: "exp_close_org", title: "รายงานการอนุมัติ/ไม่อนุมัติ ปิดโครงการ ภาพรวมทั้งองค์กร", subtitle: "สรุปสถานะการปิดโครงการทั้งองค์กร", group: "exp" },
];

/* ── Helpers ──────────────────────────────────────────── */
const YEAR_OPTIONS = Array.from({ length: 5 }, (_, i) => {
  const ce = new Date().getFullYear() - i;
  return { ce, label: String(ce + 543) };
});

function buddhistYear(ce: number): string {
  return String(ce + 543);
}

/* ── Main Page ────────────────────────────────────────── */
export default function ReportsPage() {
  const currentCE = new Date().getFullYear();
  const [year, setYear] = useState(String(currentCE));
  const [projects, setProjects] = useState<GetProjectsByOrgRespond[]>([]);
  const [byDept, setByDept] = useState<BudgetByDepartment[]>([]);
  const [orgName, setOrgName] = useState("องค์กร");
  const [generatedBy, setGeneratedBy] = useState("");
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState<ReportId | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const qs = new URLSearchParams({ limit: "500" });
        const [projRes, deptRes, meRes] = await Promise.all([
          fetch(`/api/projects?${qs}`, { cache: "no-store" }),
          fetch(`/api/dashboard/budget/by-department?year=${year}`, { cache: "no-store" }),
          fetch("/api/auth/me", { credentials: "include" }),
        ]);
        if (!mounted) return;
        if (projRes.ok) {
          const j = await projRes.json();
          setProjects(Array.isArray(j.data) ? j.data : Array.isArray(j) ? j : []);
        }
        if (deptRes.ok) {
          const j = await deptRes.json();
          setByDept(Array.isArray(j.data) ? j.data : Array.isArray(j) ? j : []);
        }
        if (meRes.ok) {
          const me = await meRes.json();
          setGeneratedBy(me?.name ?? me?.email ?? "");
          setOrgName(me?.organization_name ?? "องค์กร");
        }
      } catch (e: unknown) {
        if (mounted) setError((e as Error)?.message ?? "โหลดข้อมูลไม่สำเร็จ");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [year]);

  const generate = useCallback(
    (report: ReportDef) => {
      setGenerating(report.id);
      try {
        const fiscalYear = buddhistYear(Number(year));
        const meta = { title: report.title, subtitle: report.subtitle, orgName, fiscalYear, generatedBy, generatedAt: new Date() };
        let body = "";
        const id = report.id;
        if (id === "qa_project_plan") body = buildQA_ProjectPlanReport(projects, fiscalYear);
        else if (id === "qa_budget_standard") body = buildQA_BudgetByStandardReport(projects, fiscalYear);
        else if (id === "qa_budget_indicator") body = buildQA_BudgetByIndicatorReport(projects, [], fiscalYear);
        else if (id === "qa_budget_strategy") body = buildQA_BudgetByStrategyReport(projects, [], fiscalYear);
        else if (id === "qa_budget_dept") body = buildQA_BudgetByDepartmentReport(byDept, fiscalYear);
        else if (id === "qa_budget_org") body = buildQA_OrgBudgetSummaryReport(projects, byDept, fiscalYear, orgName);
        else if (id === "exp_org_budget") body = buildExp_OrgBudgetReport(projects, fiscalYear);
        else if (id === "exp_dept_approval" || id === "exp_dept_inner") body = buildExp_BudgetByDeptApprovalReport(projects, fiscalYear);
        else if (id === "exp_open_org") body = buildExp_ProjectOpenReport(projects, fiscalYear, false);
        else if (id === "exp_open_dept") body = buildExp_ProjectOpenReport(projects, fiscalYear, true);
        else if (id === "exp_close_dept") body = buildExp_ProjectClosureReport(projects, fiscalYear, true);
        else if (id === "exp_close_org") body = buildExp_ProjectClosureReport(projects, fiscalYear, false);
        printHTML(buildReportHTML(meta, body));
      } finally {
        setGenerating(null);
      }
    },
    [projects, byDept, orgName, generatedBy, year]
  );

  return (
    <BackGroundLight>
      <main className="w-full lg:px-18 md:px-10 sm:px-5 px-2 py-6 max-w-6xl mx-auto">
        <div className="lg:pt-0 pt-10 mb-6">
          <div className="flex items-center gap-3 mb-1">
            <FileText className="h-7 w-7 text-indigo-600" />
            <h1 className="text-2xl font-semibold text-gray-900">รายงาน</h1>
          </div>
          <p className="text-sm text-gray-500">สร้างและพิมพ์รายงานในรูปแบบ PDF สำหรับการประกันคุณภาพและงบประมาณรายจ่าย</p>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <label className="text-sm font-medium text-gray-700">ปีงบประมาณ (พ.ศ.):</label>
          <div className="relative">
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
            >
              {YEAR_OPTIONS.map((y) => (
                <option key={y.ce} value={String(y.ce)}>{y.label}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          {loading && (
            <span className="flex items-center gap-1.5 text-sm text-indigo-600">
              <Loader2 className="h-4 w-4 animate-spin" />
              กำลังโหลดข้อมูล...
            </span>
          )}
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" />{error}
          </div>
        )}

        {!loading && (
          <div className="mb-6 flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 border border-indigo-100 px-3 py-1.5 text-sm text-indigo-700">
              <FileText className="h-3.5 w-3.5" />
              โครงการทั้งหมด <strong>{projects.length}</strong> รายการ
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 border border-emerald-100 px-3 py-1.5 text-sm text-emerald-700">
              <ShieldCheck className="h-3.5 w-3.5" />
              อนุมัติแล้ว{" "}
              <strong>{projects.filter((p) => ["approved", "in_progress", "completed"].includes(p.status ?? "")).length}</strong>{" "}
              รายการ
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 border border-amber-100 px-3 py-1.5 text-sm text-amber-700">
              <Banknote className="h-3.5 w-3.5" />
              {byDept.length} แผนก/ฝ่ายงาน
            </span>
          </div>
        )}

        <ReportGroup
          icon={<ShieldCheck className="h-5 w-5 text-indigo-600" />}
          title="ด้านแผนงานการประกันคุณภาพ"
          color="indigo"
          reports={QA_REPORTS}
          generating={generating}
          onGenerate={generate}
          disabled={loading}
        />
        <ReportGroup
          icon={<Banknote className="h-5 w-5 text-emerald-600" />}
          title="ด้านแผนงานงบประมาณรายจ่ายประจำปี"
          color="emerald"
          reports={EXP_REPORTS}
          generating={generating}
          onGenerate={generate}
          disabled={loading}
        />
      </main>
    </BackGroundLight>
  );
}

/* ── Sub-component ─────────────────────────────────────── */
function ReportGroup({
  icon, title, color, reports, generating, onGenerate, disabled,
}: {
  icon: React.ReactNode;
  title: string;
  color: "indigo" | "emerald";
  reports: ReportDef[];
  generating: ReportId | null;
  onGenerate: (r: ReportDef) => void;
  disabled: boolean;
}) {
  const border = color === "indigo" ? "border-indigo-200" : "border-emerald-200";
  const bg = color === "indigo" ? "bg-indigo-50" : "bg-emerald-50";
  const text = color === "indigo" ? "text-indigo-700" : "text-emerald-700";
  const btnBg = color === "indigo" ? "bg-indigo-600 hover:bg-indigo-700" : "bg-emerald-600 hover:bg-emerald-700";

  return (
    <div className={`mb-8 rounded-xl border ${border} overflow-hidden shadow-sm`}>
      <div className={`flex items-center gap-2 px-5 py-3 ${bg} border-b ${border}`}>
        {icon}
        <h2 className={`text-base font-semibold ${text}`}>{title}</h2>
      </div>
      <div className="divide-y divide-gray-100 bg-white">
        {reports.map((r) => (
          <div key={r.id} className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-gray-50 transition-colors">
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 leading-snug">{r.title}</p>
              <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{r.subtitle}</p>
            </div>
            <button
              onClick={() => onGenerate(r)}
              disabled={disabled || generating !== null}
              className={`shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white transition ${btnBg} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {generating === r.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              {generating === r.id ? "กำลังสร้าง..." : "พิมพ์ / บันทึก PDF"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
