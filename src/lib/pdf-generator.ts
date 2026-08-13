/**
 * PDF Generator Utility
 * Uses browser's print API with a hidden iframe for reliable Thai font rendering
 */

export interface ReportMeta {
  title: string;
  subtitle?: string;
  orgName?: string;
  fiscalYear?: string;
  generatedBy?: string;
  generatedAt?: Date;
}

function thaiDate(d?: Date): string {
  const date = d ?? new Date();
  return date.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatBaht(v?: number | null): string {
  if (v == null) return "-";
  return v.toLocaleString("th-TH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function statusLabel(s?: string): string {
  const map: Record<string, string> = {
    draft: "ร่าง",
    pending_approval: "รออนุมัติ",
    approved: "อนุมัติแล้ว",
    rejected: "ไม่อนุมัติ",
    in_revision: "แก้ไข",
    in_progress: "กำลังดำเนินการ",
    completed: "เสร็จสิ้น",
    cancelled: "ยกเลิก",
  };
  return map[s ?? ""] ?? s ?? "-";
}

/** Build the full HTML document string for a report */
export function buildReportHTML(meta: ReportMeta, bodyHtml: string): string {
  const generated = thaiDate(meta.generatedAt);
  return `<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8" />
<title>${meta.title}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;600;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Sarabun',sans-serif;font-size:13pt;color:#111;background:#fff;padding:0}
  @page{size:A4;margin:18mm 16mm 18mm 20mm}
  @media print{
    body{-webkit-print-color-adjust:exact;print-color-adjust:exact}
    .no-print{display:none!important}
    thead{display:table-header-group}
    tr{page-break-inside:avoid}
  }
  /* ── Header ── */
  .rpt-header{text-align:center;margin-bottom:8mm;padding-bottom:4mm;border-bottom:2px solid #1e3a5f}
  .rpt-org{font-size:12pt;font-weight:600;color:#1e3a5f;letter-spacing:.5px}
  .rpt-title{font-size:16pt;font-weight:700;color:#1e3a5f;margin:3mm 0 1mm}
  .rpt-subtitle{font-size:11pt;color:#444;margin-bottom:2mm}
  .rpt-meta{font-size:9.5pt;color:#666;display:flex;justify-content:space-between;margin-top:3mm}
  /* ── Section ── */
  .rpt-section{margin-bottom:6mm}
  .rpt-section-title{font-size:12pt;font-weight:700;color:#1e3a5f;border-left:4px solid #1e3a5f;padding-left:6px;margin-bottom:3mm}
  /* ── Table ── */
  table{width:100%;border-collapse:collapse;font-size:10.5pt;margin-bottom:5mm}
  thead tr{background:#1e3a5f;color:#fff}
  thead th{padding:5px 7px;text-align:center;font-weight:600;border:1px solid #1e3a5f}
  tbody tr:nth-child(even){background:#f4f7fc}
  tbody tr:hover{background:#e8eef8}
  tbody td{padding:5px 7px;border:1px solid #c9d4e6;vertical-align:top}
  tfoot tr{background:#e8eef8;font-weight:700}
  tfoot td{padding:5px 7px;border:1px solid #c9d4e6}
  .text-right{text-align:right}
  .text-center{text-align:center}
  .num{text-align:right;font-variant-numeric:tabular-nums}
  /* ── Summary box ── */
  .summary-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:4mm;margin-bottom:6mm}
  .summary-card{border:1px solid #c9d4e6;border-radius:4px;padding:4mm 5mm;background:#f9fafc}
  .summary-card .label{font-size:9pt;color:#555;margin-bottom:1mm}
  .summary-card .value{font-size:14pt;font-weight:700;color:#1e3a5f}
  .summary-card .unit{font-size:9pt;color:#777}
  /* ── Status badge ── */
  .badge{display:inline-block;padding:1px 8px;border-radius:3px;font-size:9pt;font-weight:600}
  .badge-approved{background:#d1fae5;color:#065f46}
  .badge-rejected{background:#fee2e2;color:#991b1b}
  .badge-pending{background:#fef9c3;color:#713f12}
  .badge-draft{background:#f1f5f9;color:#475569}
  .badge-progress{background:#dbeafe;color:#1e40af}
  .badge-completed{background:#ede9fe;color:#4c1d95}
  /* ── Footer ── */
  .rpt-footer{margin-top:8mm;padding-top:3mm;border-top:1px solid #c9d4e6;font-size:9pt;color:#888;display:flex;justify-content:space-between}
  /* ── Signature area ── */
  .signature-row{display:flex;justify-content:flex-end;gap:20mm;margin-top:12mm}
  .signature-box{text-align:center;min-width:45mm}
  .signature-line{border-bottom:1px solid #333;margin-bottom:2mm;height:10mm}
  .signature-label{font-size:9pt;color:#555}
</style>
</head>
<body>
<div class="rpt-header">
  ${meta.orgName ? `<div class="rpt-org">${meta.orgName}</div>` : ""}
  <div class="rpt-title">${meta.title}</div>
  ${meta.subtitle ? `<div class="rpt-subtitle">${meta.subtitle}</div>` : ""}
  <div class="rpt-meta">
    <span>ปีงบประมาณ: <strong>${meta.fiscalYear ?? "-"}</strong></span>
    <span>วันที่พิมพ์: <strong>${generated}</strong></span>
    ${meta.generatedBy ? `<span>ผู้จัดทำ: <strong>${meta.generatedBy}</strong></span>` : ""}
  </div>
</div>
${bodyHtml}
<div class="rpt-footer">
  <span>ระบบบริหารงบประมาณ e-Budget</span>
  <span>พิมพ์เมื่อ ${generated}</span>
</div>
</body>
</html>`;
}

/** Open a print-ready window and trigger print dialog */
export function printHTML(html: string): void {
  const w = window.open("", "_blank", "width=900,height=700");
  if (!w) {
    alert("กรุณาอนุญาต Pop-up สำหรับเว็บไซต์นี้เพื่อพิมพ์รายงาน");
    return;
  }
  w.document.write(html);
  w.document.close();
  w.focus();
  setTimeout(() => {
    w.print();
  }, 800);
}

export { thaiDate, formatBaht, statusLabel };
