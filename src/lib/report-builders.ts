"use client";
/**
 * Report builder functions — each returns an HTML body string
 * for injection into buildReportHTML()
 */

import { formatBaht, statusLabel, thaiDate } from "@/lib/pdf-generator";
import type { GetProjectsByOrgRespond } from "@/dto/dashboardDto";
import type { BudgetByDepartment } from "@/dto/dashboardDto";

/* ────────────────────────────────────────────────────────── */
/*  QA SECTION                                                */
/* ────────────────────────────────────────────────────────── */

/** 1. รายงานสรุปแผนการดำเนินงานโครงการ/แผนงานประจำปี */
export function buildQA_ProjectPlanReport(
  projects: GetProjectsByOrgRespond[],
  year: string
): string {
  const rows = projects
    .map(
      (p, i) => `
    <tr>
      <td class="text-center">${i + 1}</td>
      <td>${p.code ?? "-"}</td>
      <td>${p.name ?? "-"}</td>
      <td class="text-center">${p.department_name ?? "-"}</td>
      <td class="text-center">${p.plan_type === "regular_work" ? "แผนงานประจำ" : "ทั่วไป"}</td>
      <td class="text-center">${formatDateTH(p.start_date)}</td>
      <td class="text-center">${formatDateTH(p.end_date)}</td>
      <td class="text-center"><span class="${badgeClass(p.status)}">${statusLabel(p.status)}</span></td>
      <td class="num">${formatBaht(p.approved_budget)}</td>
    </tr>`
    )
    .join("");

  const total = projects.reduce((s, p) => s + (p.approved_budget ?? 0), 0);

  return `
<div class="rpt-section">
  <div class="rpt-section-title">สรุปภาพรวม</div>
  <div class="summary-grid">
    <div class="summary-card"><div class="label">โครงการทั้งหมด</div><div class="value">${projects.length}</div><div class="unit">โครงการ</div></div>
    <div class="summary-card"><div class="label">แผนงานประจำ</div><div class="value">${projects.filter((p) => p.plan_type === "regular_work").length}</div><div class="unit">รายการ</div></div>
    <div class="summary-card"><div class="label">งบประมาณรวม</div><div class="value">${formatBaht(total)}</div><div class="unit">บาท</div></div>
  </div>
</div>
<div class="rpt-section">
  <div class="rpt-section-title">รายละเอียดแผนการดำเนินงาน ปีงบประมาณ ${year}</div>
  <table>
    <thead><tr>
      <th style="width:4%">#</th>
      <th style="width:8%">รหัส</th>
      <th style="width:22%">ชื่อโครงการ/แผนงาน</th>
      <th style="width:12%">หน่วยงาน</th>
      <th style="width:10%">ประเภท</th>
      <th style="width:9%">วันเริ่ม</th>
      <th style="width:9%">วันสิ้นสุด</th>
      <th style="width:10%">สถานะ</th>
      <th style="width:12%">งบประมาณ (บาท)</th>
    </tr></thead>
    <tbody>${rows}</tbody>
    <tfoot><tr>
      <td colspan="8" class="text-right">รวมงบประมาณทั้งหมด</td>
      <td class="num">${formatBaht(total)}</td>
    </tr></tfoot>
  </table>
</div>
${signatureBlock()}`;
}

/** 2. รายงานสรุปแผนงบประมาณแยกประเภทตามมาตรฐาน */
export function buildQA_BudgetByStandardReport(
  projects: GetProjectsByOrgRespond[],
  year: string
): string {
  const groups = groupBy(projects, (p) =>
    p.plan_type === "regular_work" ? "แผนงานประจำ" : "โครงการทั่วไป"
  );

  return `
<div class="rpt-section">
  <div class="rpt-section-title">สรุปงบประมาณแยกตามประเภทมาตรฐาน ปีงบประมาณ ${year}</div>
  ${Object.entries(groups)
    .map(([type, items]) => {
      const total = items.reduce((s, p) => s + (p.approved_budget ?? 0), 0);
      return `
    <div style="margin-bottom:5mm"><strong>${type}</strong> (${items.length} รายการ)</div>
    <table>
      <thead><tr>
        <th style="width:5%">#</th>
        <th style="width:10%">รหัส</th>
        <th style="width:30%">ชื่อโครงการ/แผนงาน</th>
        <th style="width:15%">หน่วยงาน</th>
        <th style="width:10%">สถานะ</th>
        <th style="width:15%">งบประมาณ (บาท)</th>
      </tr></thead>
      <tbody>${items
        .map(
          (p, i) => `<tr>
        <td class="text-center">${i + 1}</td>
        <td>${p.code ?? "-"}</td>
        <td>${p.name}</td>
        <td class="text-center">${p.department_name ?? "-"}</td>
        <td class="text-center"><span class="${badgeClass(p.status)}">${statusLabel(p.status)}</span></td>
        <td class="num">${formatBaht(p.approved_budget)}</td>
      </tr>`
        )
        .join("")}</tbody>
      <tfoot><tr><td colspan="5" class="text-right">รวม${type}</td><td class="num">${formatBaht(total)}</td></tr></tfoot>
    </table>`;
    })
    .join("")}
</div>
${signatureBlock()}`;
}

/** 3. รายงานสรุปแผนงบประมาณแยกตามตัวบ่งชี้ QA */
export function buildQA_BudgetByIndicatorReport(
  projects: GetProjectsByOrgRespond[],
  qaIndicators: { id: string; name: string; projects?: string[] }[],
  year: string
): string {
  const rows = qaIndicators
    .map((qa, i) => {
      const matched = projects.filter((p) =>
        (qa.projects ?? []).includes(p.id)
      );
      const total = matched.reduce((s, p) => s + (p.approved_budget ?? 0), 0);
      return `<tr>
      <td class="text-center">${i + 1}</td>
      <td>${qa.name}</td>
      <td class="text-center">${matched.length}</td>
      <td class="num">${formatBaht(total)}</td>
      <td>${matched.map((p) => p.name).join(", ") || "-"}</td>
    </tr>`;
    })
    .join("");

  return `
<div class="rpt-section">
  <div class="rpt-section-title">สรุปงบประมาณแยกตามตัวบ่งชี้การประกันคุณภาพ ปีงบประมาณ ${year}</div>
  <table>
    <thead><tr>
      <th style="width:5%">#</th>
      <th style="width:30%">ตัวบ่งชี้</th>
      <th style="width:10%">จำนวนโครงการ</th>
      <th style="width:15%">งบประมาณรวม (บาท)</th>
      <th style="width:35%">โครงการที่เกี่ยวข้อง</th>
    </tr></thead>
    <tbody>${rows}</tbody>
  </table>
</div>
${signatureBlock()}`;
}

/** 4. รายงานสรุปแผนงบประมาณแยกตามแผนยุทธศาสตร์ */
export function buildQA_BudgetByStrategyReport(
  projects: GetProjectsByOrgRespond[],
  strategies: { id: string; name: string }[],
  year: string
): string {
  const total = projects.reduce((s, p) => s + (p.approved_budget ?? 0), 0);
  const rows = strategies
    .map((str, i) => {
      const matched = projects.filter((p) =>
        (p as any).strategy_id === str.id
      );
      const sub = matched.reduce((s, p) => s + (p.approved_budget ?? 0), 0);
      return `<tr>
      <td class="text-center">${i + 1}</td>
      <td>${str.name}</td>
      <td class="text-center">${matched.length}</td>
      <td class="num">${formatBaht(sub)}</td>
      <td class="num">${total > 0 ? ((sub / total) * 100).toFixed(1) + "%" : "-"}</td>
    </tr>`;
    })
    .join("");

  return `
<div class="rpt-section">
  <div class="rpt-section-title">สรุปงบประมาณแยกตามแผนยุทธศาสตร์ ปีงบประมาณ ${year}</div>
  <table>
    <thead><tr>
      <th style="width:5%">#</th>
      <th style="width:35%">แผนยุทธศาสตร์</th>
      <th style="width:15%">จำนวนโครงการ</th>
      <th style="width:20%">งบประมาณ (บาท)</th>
      <th style="width:15%">สัดส่วน (%)</th>
    </tr></thead>
    <tbody>${rows}</tbody>
    <tfoot><tr>
      <td colspan="2" class="text-right">รวมทั้งหมด</td>
      <td class="text-center">${projects.length}</td>
      <td class="num">${formatBaht(total)}</td>
      <td class="text-center">100%</td>
    </tr></tfoot>
  </table>
</div>
${signatureBlock()}`;
}

/** 5. รายงานสรุปแผนงบประมาณแยกตามแผนกหรือฝ่ายงาน */
export function buildQA_BudgetByDepartmentReport(
  byDept: BudgetByDepartment[],
  year: string
): string {
  const grandTotal = byDept.reduce((s, d) => s + (d.budget ?? 0), 0);
  const rows = byDept
    .map(
      (d, i) => `<tr>
    <td class="text-center">${i + 1}</td>
    <td>${d.department_code ?? "-"}</td>
    <td>${d.department ?? "-"}</td>
    <td class="num">${formatBaht(d.budget)}</td>
    <td class="num">${formatBaht(d.actual)}</td>
    <td class="num">${d.budget > 0 ? ((d.actual / d.budget) * 100).toFixed(1) + "%" : "-"}</td>
  </tr>`
    )
    .join("");

  return `
<div class="rpt-section">
  <div class="rpt-section-title">สรุปงบประมาณแยกตามแผนก/ฝ่ายงาน ปีงบประมาณ ${year}</div>
  <div class="summary-grid">
    <div class="summary-card"><div class="label">จำนวนแผนก</div><div class="value">${byDept.length}</div><div class="unit">แผนก</div></div>
    <div class="summary-card"><div class="label">งบประมาณรวม</div><div class="value">${formatBaht(grandTotal)}</div><div class="unit">บาท</div></div>
    <div class="summary-card"><div class="label">ใช้จริงรวม</div><div class="value">${formatBaht(byDept.reduce((s, d) => s + (d.actual ?? 0), 0))}</div><div class="unit">บาท</div></div>
  </div>
  <table>
    <thead><tr>
      <th style="width:5%">#</th>
      <th style="width:8%">รหัส</th>
      <th style="width:25%">แผนก/ฝ่ายงาน</th>
      <th style="width:18%">งบประมาณที่ได้รับ (บาท)</th>
      <th style="width:18%">ใช้จริง (บาท)</th>
      <th style="width:12%">% การใช้</th>
    </tr></thead>
    <tbody>${rows}</tbody>
    <tfoot><tr>
      <td colspan="3" class="text-right">รวมทั้งหมด</td>
      <td class="num">${formatBaht(grandTotal)}</td>
      <td class="num">${formatBaht(byDept.reduce((s, d) => s + (d.actual ?? 0), 0))}</td>
      <td class="text-center">-</td>
    </tr></tfoot>
  </table>
</div>
${signatureBlock()}`;
}

/** 6. รายงานสรุปแผนงบประมาณภาพรวมองค์กร */
export function buildQA_OrgBudgetSummaryReport(
  projects: GetProjectsByOrgRespond[],
  byDept: BudgetByDepartment[],
  year: string,
  orgName: string
): string {
  const totalBudget = projects.reduce(
    (s, p) => s + (p.approved_budget ?? 0),
    0
  );
  const approved = projects.filter((p) => p.status === "approved");
  const pending = projects.filter((p) => p.status === "pending_approval");
  const draft = projects.filter((p) => p.status === "draft");

  return `
<div class="rpt-section">
  <div class="rpt-section-title">ภาพรวมองค์กร</div>
  <div class="summary-grid">
    <div class="summary-card"><div class="label">โครงการทั้งหมด</div><div class="value">${projects.length}</div><div class="unit">โครงการ</div></div>
    <div class="summary-card"><div class="label">งบประมาณรวม</div><div class="value">${formatBaht(totalBudget)}</div><div class="unit">บาท</div></div>
    <div class="summary-card"><div class="label">อนุมัติแล้ว</div><div class="value">${approved.length}</div><div class="unit">โครงการ</div></div>
    <div class="summary-card"><div class="label">รออนุมัติ</div><div class="value">${pending.length}</div><div class="unit">โครงการ</div></div>
    <div class="summary-card"><div class="label">ร่าง</div><div class="value">${draft.length}</div><div class="unit">โครงการ</div></div>
    <div class="summary-card"><div class="label">จำนวนแผนก</div><div class="value">${byDept.length}</div><div class="unit">แผนก</div></div>
  </div>
</div>
<div class="rpt-section">
  <div class="rpt-section-title">สัดส่วนงบประมาณรายแผนก</div>
  <table>
    <thead><tr>
      <th style="width:5%">#</th>
      <th style="width:30%">แผนก/ฝ่ายงาน</th>
      <th style="width:20%">งบประมาณ (บาท)</th>
      <th style="width:15%">สัดส่วน</th>
      <th style="width:20%">ใช้จริง (บาท)</th>
    </tr></thead>
    <tbody>${byDept
      .map(
        (d, i) => `<tr>
      <td class="text-center">${i + 1}</td>
      <td>${d.department}</td>
      <td class="num">${formatBaht(d.budget)}</td>
      <td class="num">${totalBudget > 0 ? ((d.budget / totalBudget) * 100).toFixed(1) + "%" : "-"}</td>
      <td class="num">${formatBaht(d.actual)}</td>
    </tr>`
      )
      .join("")}</tbody>
  </table>
</div>
${signatureBlock()}`;
}

/* ────────────────────────────────────────────────────────── */
/*  EXPENDITURE BUDGET SECTION                               */
/* ────────────────────────────────────────────────────────── */

/** 7. รายงานสรุปแผนงบประมาณรายจ่ายประจำปี ภาพรวมทั้งองค์กร */
export function buildExp_OrgBudgetReport(
  projects: GetProjectsByOrgRespond[],
  year: string
): string {
  const approved = projects.filter((p) =>
    ["approved", "in_progress", "completed"].includes(p.status ?? "")
  );
  const notApproved = projects.filter((p) =>
    ["rejected", "draft", "pending_approval"].includes(p.status ?? "")
  );
  const totalApproved = approved.reduce(
    (s, p) => s + (p.approved_budget ?? 0),
    0
  );
  const totalNot = notApproved.reduce(
    (s, p) => s + (p.approved_budget ?? 0),
    0
  );

  return `
<div class="rpt-section">
  <div class="rpt-section-title">ภาพรวมแผนงบประมาณรายจ่ายประจำปี ${year}</div>
  <div class="summary-grid">
    <div class="summary-card"><div class="label">โครงการทั้งหมด</div><div class="value">${projects.length}</div><div class="unit">โครงการ</div></div>
    <div class="summary-card"><div class="label">งบอนุมัติรวม</div><div class="value">${formatBaht(totalApproved)}</div><div class="unit">บาท</div></div>
    <div class="summary-card"><div class="label">โครงการที่ได้รับอนุมัติ</div><div class="value">${approved.length}</div><div class="unit">โครงการ</div></div>
  </div>
</div>
<div class="rpt-section">
  <div class="rpt-section-title">รายการที่ได้รับอนุมัติ</div>
  ${projectTable(approved)}
</div>
<div class="rpt-section">
  <div class="rpt-section-title">รายการที่ยังไม่ได้รับอนุมัติ / ไม่อนุมัติ</div>
  ${projectTable(notApproved)}
</div>
${signatureBlock()}`;
}

/** 8-9. รายงานสรุปแผนงบประมาณรายจ่ายประจำปี แยกรายแผน/ฝ่ายงาน */
export function buildExp_BudgetByDeptApprovalReport(
  projects: GetProjectsByOrgRespond[],
  year: string
): string {
  const depts = [...new Set(projects.map((p) => p.department_name ?? "ไม่ระบุ"))];

  return `
<div class="rpt-section">
  <div class="rpt-section-title">งบประมาณรายจ่ายประจำปี ${year} แยกตามแผนก/ฝ่ายงาน</div>
  ${depts
    .map((dept) => {
      const items = projects.filter(
        (p) => (p.department_name ?? "ไม่ระบุ") === dept
      );
      const appItems = items.filter((p) =>
        ["approved", "in_progress", "completed"].includes(p.status ?? "")
      );
      const notItems = items.filter(
        (p) =>
          !["approved", "in_progress", "completed"].includes(p.status ?? "")
      );
      const totalApp = appItems.reduce((s, p) => s + (p.approved_budget ?? 0), 0);
      const totalNot = notItems.reduce((s, p) => s + (p.approved_budget ?? 0), 0);

      return `
    <div style="margin-bottom:2mm;background:#e8eef8;padding:3mm 5mm;border-radius:3px">
      <strong>${dept}</strong> — อนุมัติแล้ว ${appItems.length} รายการ (${formatBaht(totalApp)} บาท) | 
      ยังไม่อนุมัติ ${notItems.length} รายการ (${formatBaht(totalNot)} บาท)
    </div>
    ${appItems.length > 0 ? `<div style="margin:2mm 0 1mm;font-size:10pt;font-weight:600;color:#065f46">ที่ได้รับอนุมัติ</div>${projectTable(appItems)}` : ""}
    ${notItems.length > 0 ? `<div style="margin:2mm 0 1mm;font-size:10pt;font-weight:600;color:#991b1b">ที่ไม่ได้รับอนุมัติ</div>${projectTable(notItems)}` : ""}`;
    })
    .join("")}
</div>
${signatureBlock()}`;
}

/** 10-11. รายงานการดำเนินงานเปิดโครงการ */
export function buildExp_ProjectOpenReport(
  projects: GetProjectsByOrgRespond[],
  year: string,
  byDept?: boolean
): string {
  const active = projects.filter((p) =>
    ["in_progress", "approved"].includes(p.status ?? "")
  );

  if (!byDept) {
    return `
<div class="rpt-section">
  <div class="rpt-section-title">รายงานการดำเนินงานเปิดโครงการ ภาพรวมทั้งองค์กร ปี ${year}</div>
  <div class="summary-grid">
    <div class="summary-card"><div class="label">โครงการที่กำลังดำเนินงาน</div><div class="value">${active.length}</div><div class="unit">โครงการ</div></div>
    <div class="summary-card"><div class="label">งบประมาณรวม</div><div class="value">${formatBaht(active.reduce((s, p) => s + (p.approved_budget ?? 0), 0))}</div><div class="unit">บาท</div></div>
    <div class="summary-card"><div class="label">หน่วยงานที่เกี่ยวข้อง</div><div class="value">${new Set(active.map((p) => p.department_name)).size}</div><div class="unit">แผนก</div></div>
  </div>
  ${projectTable(active)}
</div>
${signatureBlock()}`;
  }

  const depts = [...new Set(active.map((p) => p.department_name ?? "ไม่ระบุ"))];
  return `
<div class="rpt-section">
  <div class="rpt-section-title">รายงานการดำเนินงานเปิดโครงการ แยกรายแผนก/ฝ่ายงาน ปี ${year}</div>
  ${depts
    .map((dept) => {
      const items = active.filter((p) => (p.department_name ?? "ไม่ระบุ") === dept);
      return `<div style="margin-bottom:2mm;background:#dbeafe;padding:3mm 5mm;border-radius:3px"><strong>${dept}</strong> (${items.length} โครงการ)</div>${projectTable(items)}`;
    })
    .join("")}
</div>
${signatureBlock()}`;
}

/** 12-13. รายงานการอนุมัติ/ไม่อนุมัติ ปิดโครงการ */
export function buildExp_ProjectClosureReport(
  projects: GetProjectsByOrgRespond[],
  year: string,
  byDept?: boolean
): string {
  const closed = projects.filter((p) =>
    ["completed", "rejected", "cancelled"].includes(p.status ?? "")
  );
  const completed = closed.filter((p) => p.status === "completed");
  const rejected = closed.filter((p) => ["rejected", "cancelled"].includes(p.status ?? ""));

  if (!byDept) {
    return `
<div class="rpt-section">
  <div class="rpt-section-title">รายงานการอนุมัติ/ไม่อนุมัติ ปิดโครงการ ภาพรวมทั้งองค์กร ปี ${year}</div>
  <div class="summary-grid">
    <div class="summary-card"><div class="label">ปิดโครงการแล้ว</div><div class="value">${closed.length}</div><div class="unit">โครงการ</div></div>
    <div class="summary-card"><div class="label">เสร็จสิ้น (อนุมัติ)</div><div class="value">${completed.length}</div><div class="unit">โครงการ</div></div>
    <div class="summary-card"><div class="label">ไม่อนุมัติ/ยกเลิก</div><div class="value">${rejected.length}</div><div class="unit">โครงการ</div></div>
  </div>
  <div style="margin-bottom:2mm;font-weight:700;color:#065f46">โครงการที่เสร็จสิ้น (อนุมัติ)</div>
  ${projectTable(completed)}
  <div style="margin-bottom:2mm;font-weight:700;color:#991b1b">โครงการที่ไม่อนุมัติ/ยกเลิก</div>
  ${projectTable(rejected)}
</div>
${signatureBlock()}`;
  }

  const depts = [...new Set(closed.map((p) => p.department_name ?? "ไม่ระบุ"))];
  return `
<div class="rpt-section">
  <div class="rpt-section-title">รายงานการอนุมัติ/ไม่อนุมัติ ปิดโครงการ แยกตามแผนก/ฝ่ายงาน ปี ${year}</div>
  ${depts
    .map((dept) => {
      const dComp = completed.filter((p) => (p.department_name ?? "ไม่ระบุ") === dept);
      const dRej = rejected.filter((p) => (p.department_name ?? "ไม่ระบุ") === dept);
      return `
    <div style="margin-bottom:2mm;background:#f1f5f9;padding:3mm 5mm;border-radius:3px;font-weight:700">${dept}</div>
    ${dComp.length > 0 ? `<div style="margin:2mm 0 1mm;font-size:10pt;color:#065f46;font-weight:600">เสร็จสิ้น (อนุมัติ) — ${dComp.length} รายการ</div>${projectTable(dComp)}` : ""}
    ${dRej.length > 0 ? `<div style="margin:2mm 0 1mm;font-size:10pt;color:#991b1b;font-weight:600">ไม่อนุมัติ/ยกเลิก — ${dRej.length} รายการ</div>${projectTable(dRej)}` : ""}`;
    })
    .join("")}
</div>
${signatureBlock()}`;
}

/* ────────────────────────────────────────────────────────── */
/*  Helpers                                                  */
/* ────────────────────────────────────────────────────────── */

function projectTable(items: GetProjectsByOrgRespond[]): string {
  if (items.length === 0)
    return `<p style="font-size:10pt;color:#888;margin-bottom:4mm">ไม่มีข้อมูล</p>`;
  const total = items.reduce((s, p) => s + (p.approved_budget ?? 0), 0);
  return `<table>
    <thead><tr>
      <th style="width:5%">#</th>
      <th style="width:10%">รหัส</th>
      <th style="width:28%">ชื่อโครงการ/แผนงาน</th>
      <th style="width:15%">หน่วยงาน</th>
      <th style="width:9%">ประเภท</th>
      <th style="width:9%">สถานะ</th>
      <th style="width:18%">งบประมาณ (บาท)</th>
    </tr></thead>
    <tbody>${items
      .map(
        (p, i) => `<tr>
      <td class="text-center">${i + 1}</td>
      <td>${p.code ?? "-"}</td>
      <td>${p.name}</td>
      <td class="text-center">${p.department_name ?? "-"}</td>
      <td class="text-center">${p.plan_type === "regular_work" ? "แผนงานประจำ" : "ทั่วไป"}</td>
      <td class="text-center"><span class="${badgeClass(p.status)}">${statusLabel(p.status)}</span></td>
      <td class="num">${formatBaht(p.approved_budget)}</td>
    </tr>`
      )
      .join("")}</tbody>
    <tfoot><tr>
      <td colspan="6" class="text-right">รวม</td>
      <td class="num">${formatBaht(total)}</td>
    </tr></tfoot>
  </table>`;
}

function signatureBlock(): string {
  return `<div class="signature-row">
  <div class="signature-box">
    <div class="signature-line"></div>
    <div class="signature-label">ผู้จัดทำรายงาน</div>
    <div class="signature-label">วันที่ ....................</div>
  </div>
  <div class="signature-box">
    <div class="signature-line"></div>
    <div class="signature-label">ผู้ตรวจสอบ</div>
    <div class="signature-label">วันที่ ....................</div>
  </div>
  <div class="signature-box">
    <div class="signature-line"></div>
    <div class="signature-label">ผู้อนุมัติรายงาน</div>
    <div class="signature-label">วันที่ ....................</div>
  </div>
</div>`;
}

function badgeClass(status?: string): string {
  const map: Record<string, string> = {
    approved: "badge badge-approved",
    completed: "badge badge-completed",
    rejected: "badge badge-rejected",
    pending_approval: "badge badge-pending",
    in_revision: "badge badge-pending",
    in_progress: "badge badge-progress",
    draft: "badge badge-draft",
  };
  return map[status ?? ""] ?? "badge badge-draft";
}

function groupBy<T>(arr: T[], key: (item: T) => string): Record<string, T[]> {
  return arr.reduce(
    (acc, item) => {
      const k = key(item);
      if (!acc[k]) acc[k] = [];
      acc[k].push(item);
      return acc;
    },
    {} as Record<string, T[]>
  );
}

function formatDateTH(iso?: string | null): string {
  if (!iso) return "-";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("th-TH", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
