export type Priority = "high" | "medium" | "low"

export interface ApprovalItem {
  project: string
  dept: string
  amount: string
  owner: string
  stage: string
  lastUpdate: string
  priority: Priority
}

export const MOCK_APPROVALS: ApprovalItem[] = [
  { project: "ปรับปรุงหลักสูตรวิทยาศาสตร์", dept: "วิชาการ", amount: "฿850,000",  owner: "ดร.สมชาย ใจดี", stage: "รอผู้อำนวยการ", lastUpdate: "2 ชม.", priority: "high" },
  { project: "จัดซื้อครุภัณฑ์คอมพิวเตอร์",   dept: "การเงิน",  amount: "฿1,250,000", owner: "นางสาวมานี รักงาน", stage: "รอหัวหน้าฝ่าย", lastUpdate: "5 ชม.", priority: "medium" },
  { project: "โครงการพัฒนาบุคลากร",         dept: "ฝ่ายแผน",  amount: "฿450,000",  owner: "นายประสิทธิ์ ทำดี",  stage: "รอผู้อำนวยการ", lastUpdate: "1 วัน", priority: "high" },
  { project: "ระบบทะเบียนออนไลน์",           dept: "ทะเบียน",  amount: "฿2,100,000", owner: "นางสาววิไล เก่งงาน", stage: "รอหัวหน้าฝ่าย", lastUpdate: "2 วัน", priority: "low" },
]


export interface BudgetByDept { dept: string; approved: number; pending: number; rejected: number }
export const MOCK_BUDGET_BY_DEPT: BudgetByDept[] = [
  { dept: "ฝ่ายแผน",       approved: 35, pending: 8,  rejected: 2 },
  { dept: "วิชาการ",       approved: 52, pending: 12, rejected: 3 },
  { dept: "การเงิน",       approved: 28, pending: 5,  rejected: 1 },
  { dept: "ทะเบียน",       approved: 42, pending: 7,  rejected: 2 },
  { dept: "กิจการนักเรียน", approved: 38, pending: 6,  rejected: 4 },
]

export interface ProjectTypeRatio { name: string; value: number; color: string }
export const MOCK_PROJECT_TYPES: ProjectTypeRatio[] = [
  { name: "งานประจำ", value: 156, color: "hsl(var(--chart-1))" },
  { name: "โครงการ",  value: 139, color: "hsl(var(--chart-4))" },
]

export type ProjectStatus = "approved" | "pending" | "rejected" | "closed"
export interface ProjectRow {
  name: string
  dept: string
  type: string
  amount: string
  status: ProjectStatus
  qaCount: number
  strategy: string
  period: string
}
export const MOCK_PROJECTS: ProjectRow[] = [
  { name: "ปรับปรุงหลักสูตรวิทยาศาสตร์", dept: "วิชาการ",       type: "โครงการ", amount: "฿850,000",  status: "approved", qaCount: 3, strategy: "S2 Quality",   period: "ม.ค. - มี.ค. 68" },
  { name: "จัดซื้อครุภัณฑ์คอมพิวเตอร์",   dept: "การเงิน",        type: "งานประจำ", amount: "฿1,250,000",status: "pending",  qaCount: 2, strategy: "S1 Efficiency", period: "ก.พ. - เม.ย. 68" },
  { name: "โครงการพัฒนาบุคลากร",         dept: "ฝ่ายแผน",        type: "โครงการ", amount: "฿450,000",  status: "approved", qaCount: 4, strategy: "S2 Quality",   period: "ม.ค. - มิ.ย. 68" },
  { name: "ระบบทะเบียนออนไลน์",           dept: "ทะเบียน",        type: "โครงการ", amount: "฿2,100,000",status: "pending",  qaCount: 5, strategy: "S3 Innovation", period: "ม.ค. - ธ.ค. 68" },
  { name: "กิจกรรมพัฒนานักเรียน",         dept: "กิจการนักเรียน",  type: "งานประจำ", amount: "฿320,000",  status: "approved", qaCount: 2, strategy: "S2 Quality",   period: "ม.ค. - มี.ค. 68" },
  { name: "ปรับปรุงห้องสมุด",             dept: "วิชาการ",       type: "โครงการ", amount: "฿680,000",  status: "rejected", qaCount: 1, strategy: "S1 Efficiency", period: "ก.พ. - พ.ค. 68" },
  { name: "ระบบบัญชีอัตโนมัติ",           dept: "การเงิน",        type: "โครงการ", amount: "฿1,800,000",status: "approved", qaCount: 3, strategy: "S3 Innovation", period: "ม.ค. - ก.ย. 68" },
  { name: "จัดซื้อวัสดุสำนักงาน",          dept: "ฝ่ายแผน",        type: "งานประจำ", amount: "฿180,000",  status: "closed",   qaCount: 1, strategy: "S1 Efficiency", period: "ต.ค. - ธ.ค. 67" },
]
// ====== เพิ่มต่อจาก MOCK_PROJECTS ด้านบน ======

// แจ้งเตือนในศูนย์ Notification
export interface NotificationItem {
  id: string
  title: string
  message?: string
  project?: string
  createdAt: string // ISO
  read: boolean
}
export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  { id: "n-101", title: "โครงการของคุณถูกขอแก้ไข", message: "เพิ่ม KPI เชิงปริมาณ", project: "ปรับปรุงหลักสูตรวิทยาศาสตร์", createdAt: "2026-02-10T09:30:00+07:00", read: false },
  { id: "n-102", title: "โครงการได้รับการอนุมัติ", message: "ระบบบัญชีอัตโนมัติ", project: "ระบบบัญชีอัตโนมัติ", createdAt: "2026-02-09T15:00:00+07:00", read: false },
  { id: "n-103", title: "ใกล้ครบกำหนดปิดโครงการ", project: "กิจกรรมพัฒนานักเรียน", createdAt: "2026-02-08T08:00:00+07:00", read: true },
]

// ปฏิทินโครงการ (ใช้ใน Calendar View)
export type CalendarStatus = "approved" | "pending" | "closed"
export interface CalendarEvent {
  title: string
  dept: string
  start: string // ISO
  end: string   // ISO
  status: CalendarStatus
}
export const MOCK_CALENDAR: CalendarEvent[] = [
  { title: "ปรับปรุงหลักสูตรวิทยาศาสตร์", dept: "วิชาการ", start: "2026-01-10", end: "2026-03-25", status: "approved" },
  { title: "จัดซื้อครุภัณฑ์คอมพิวเตอร์",   dept: "การเงิน", start: "2026-02-01", end: "2026-04-30", status: "pending" },
  { title: "โครงการพัฒนาบุคลากร",  dept: "ฝ่ายแผน", start: "2026-01-15", end: "2026-06-30", status: "approved" },
  { title: "ระบบทะเบียนออนไลน์",           dept: "ทะเบียน", start: "2026-01-01", end: "2026-12-31", status: "pending" },
  { title: "กิจกรรมพัฒนานักเรียน",         dept: "กิจการนักเรียน", start: "2026-01-05", end: "2026-03-20", status: "approved" },
]

export type CalendarEventModel = {
  id: string;
  title: string;
  start_date: Date | string;
  plan_id?: string;
  end_date?: Date | string;
  department?: string;
  status?: string;
};



export interface StrategyItem { code: string; name: string }
export const MOCK_STRATEGIES: StrategyItem[] = [
  { code: "S1", name: "Efficiency" },
  { code: "S2", name: "Quality" },
  { code: "S3", name: "Innovation" },
  { code: "S4", name: "Sustainability" },
]

// สรุปแนวโน้มงบประมาณรายเดือน (ใช้ทำกราฟเส้น/แท่งใน Dashboard)
export interface BudgetTrendPoint { month: string; approved: number; pending: number; rejected: number }
export const MOCK_BUDGET_TREND: BudgetTrendPoint[] = [
  { month: "ต.ค.", approved: 2.1, pending: 0.4, rejected: 0.1 },
  { month: "พ.ย.", approved: 1.8, pending: 0.6, rejected: 0.2 },
  { month: "ธ.ค.", approved: 2.6, pending: 0.5, rejected: 0.0 },
  { month: "ม.ค.", approved: 3.4, pending: 0.9, rejected: 0.3 },
  { month: "ก.พ.", approved: 2.9, pending: 1.1, rejected: 0.2 },
  { month: "มี.ค.", approved: 3.2, pending: 0.7, rejected: 0.2 },
]
// *หน่วยเป็น “ล้านบาท” เพื่อทำกราฟง่าย ๆ

// สรุปรายแผนก (จำนวน + วงเงินรวม) ใช้ทำตาราง/การ์ด
export interface DeptSummary {
  dept: string
  totalProjects: number
  approved: number
  pending: number
  rejected: number
  closed: number
  totalBudget: string
}
export const MOCK_DEPT_SUMMARY: DeptSummary[] = [
  { dept: "ฝ่ายแผน", totalProjects: 43, approved: 28, pending: 9, rejected: 2, closed: 4, totalBudget: "฿12,450,000" },
  { dept: "วิชาการ", totalProjects: 67, approved: 52, pending: 12, rejected: 1, closed: 2, totalBudget: "฿24,880,000" },
  { dept: "การเงิน", totalProjects: 36, approved: 28, pending: 5, rejected: 1, closed: 2, totalBudget: "฿18,120,000" },
  { dept: "ทะเบียน", totalProjects: 49, approved: 42, pending: 5, rejected: 0, closed: 2, totalBudget: "฿15,760,000" },
]

// ไทม์ไลน์การอนุมัติ (ใช้แสดงใน Project Detail > Approval)
export type ApprovalAction = "approve" | "reject" | "request_revision"
export interface ApprovalTimelineItem {
  step: 1 | 2 | 3
  role: "หัวหน้าแผนก" | "ฝ่ายแผน" | "ผู้อำนวยการ"
  user: string
  action: ApprovalAction
  at: string // ISO
  comment?: string
}
export const MOCK_APPROVAL_TIMELINE: Record<string, ApprovalTimelineItem[]> = {
  // key = ชื่อโครงการ หรือ id โครงการที่คุณใช้ mapping
  "ปรับปรุงหลักสูตรวิทยาศาสตร์": [
    { step: 1, role: "หัวหน้าแผนก", user: "น.ส. ศิริยา แผนดี", action: "approve", at: "2026-01-20T10:00:00+07:00", comment: "ผ่านหลักการ" },
    { step: 2, role: "ฝ่ายแผน",    user: "นาย ปกรณ์ วางแผน", action: "request_revision", at: "2026-01-22T14:30:00+07:00", comment: "เพิ่ม KPI เชิงปริมาณ" },
  ],
  "ระบบบัญชีอัตโนมัติ": [
    { step: 1, role: "หัวหน้าแผนก", user: "น.ส. วราภรณ์ การเงิน", action: "approve", at: "2026-01-10T09:00:00+07:00" },
    { step: 2, role: "ฝ่ายแผน",    user: "นาย ปกรณ์ วางแผน", action: "approve", at: "2026-01-12T11:10:00+07:00" },
    { step: 3, role: "ผู้อำนวยการ", user: "ดร. สมชาย ใจดี",  action: "approve", at: "2026-01-15T16:00:00+07:00" },
  ],
}

// ความเห็นแก้ไข (Revision) สำหรับหน้า Edit/Feedback
export interface RevisionComment {
  byRole: "หัวหน้าแผนก" | "ฝ่ายแผน" | "ผู้อำนวยการ"
  comment: string
  at: string
}
export const MOCK_REVISIONS: Record<string, RevisionComment[]> = {
  "ปรับปรุงหลักสูตรวิทยาศาสตร์": [
    { byRole: "ฝ่ายแผน", comment: "ขอเพิ่มตัวชี้วัดผลลัพธ์ผู้เรียน (จำนวนผลงาน/คะแนนเฉลี่ย)", at: "2026-01-22T14:30:00+07:00" },
  ],
}

// ไฟล์แนบในโครงการ (ใช้แท็บ Files)
export type FileKind = "proposal" | "quote" | "approval" | "closure" | "other"
export interface ProjectFile {
  name: string
  kind: FileKind
  url: string
  uploadedBy: string
  at: string
}
export const MOCK_PROJECT_FILES: Record<string, ProjectFile[]> = {
  "ปรับปรุงหลักสูตรวิทยาศาสตร์": [
    { name: "TOR_หลักสูตรX.pdf", kind: "proposal", url: "#", uploadedBy: "ดร.สมชาย ใจดี", at: "2026-01-12T09:10:00+07:00" },
    { name: "ใบเสนอราคา_labA.pdf", kind: "quote", url: "#", uploadedBy: "ดร.สมชาย ใจดี", at: "2026-01-15T10:00:00+07:00" },
  ],
  "ระบบบัญชีอัตโนมัติ": [
    { name: "แผนโครงการ_บัญชีอัตโนมัติ.pdf", kind: "proposal", url: "#", uploadedBy: "นางสาวมานี รักงาน", at: "2026-01-05T08:30:00+07:00" },
    { name: "รายงานปิดโครงการ.pdf", kind: "closure", url: "#", uploadedBy: "นางสาวมานี รักงาน", at: "2026-09-25T16:45:00+07:00" },
  ],
}

// โซ่อนุมัติระดับองค์กร (สำหรับแสดงใน Settings หรือ side panel)
export interface ApprovalChainItem { level: 1 | 2 | 3; role: string; name: string }
export const MOCK_APPROVAL_CHAIN: ApprovalChainItem[] = [
  { level: 1, role: "หัวหน้าแผนก",   name: "น.ส. ศิริยา แผนดี" },
  { level: 2, role: "ฝ่ายแผน",       name: "นาย ปกรณ์ วางแผน" },
  { level: 3, role: "ผู้อำนวยการ",  name: "ดร. สมชาย ใจดี" },
]

// KPI ของโครงการ (ใช้ใน Project Detail > KPI)
export interface KPIItem { name: string; target: number; actual: number; unit: string; progress: number } // progress = 0..100
export const MOCK_PROJECT_KPIS: Record<string, KPIItem[]> = {
  "ปรับปรุงหลักสูตรวิทยาศาสตร์": [
    { name: "อัตราการผ่านผลลัพธ์การเรียนรู้", target: 85, actual: 78, unit: "%", progress: 78 },
    { name: "จำนวนกิจกรรมการเรียนรู้เชิงรุก", target: 12, actual: 8, unit: "ครั้ง", progress: 66 },
  ],
  "โครงการพัฒนาบุคลากร": [
    { name: "ชั่วโมงอบรมเฉลี่ย/คน", target: 24, actual: 20, unit: "ชั่วโมง", progress: 83 },
  ],
}

// ความครอบคลุมตามยุทธศาสตร์/QA (ใช้ widget ใน Dashboard)
export interface StrategyCoverage { strategy: string; projects: number; budget: string }
export const MOCK_STRATEGY_COVERAGE: StrategyCoverage[] = [
  { strategy: "S1 Efficiency", projects: 48, budget: "฿18,400,000" },
  { strategy: "S2 Quality",    projects: 72, budget: "฿26,900,000" },
  { strategy: "S3 Innovation", projects: 39, budget: "฿22,100,000" },
]

export interface QACoverage { code: string; name: string; projects: number; gaps: boolean }
export const MOCK_QA_COVERAGE: QACoverage[] = [
  { code: "QA-2.1", name: "ผู้เรียนเป็นศูนย์กลาง", projects: 64, gaps: false },
  { code: "QA-3.2", name: "คุณภาพหลักสูตร",       projects: 31, gaps: true },
  { code: "QA-4.1", name: "พัฒนาครูและบุคลากร",   projects: 22, gaps: false },
]

// งานค้างส่วนตัวของผู้ใช้ (ใช้ใน My Project / Dashboard widget)
export interface TodoItem { id: string; title: string; project?: string; due?: string; priority: Priority; done: boolean }
export const MOCK_TODOS: TodoItem[] = [
  { id: "td-1", title: "อัปเดต KPI โครงการ ปรับปรุงหลักสูตร", project: "ปรับปรุงหลักสูตรวิทยาศาสตร์", due: "2026-02-12", priority: "high", done: false },
  { id: "td-2", title: "แนบใบเสนอราคา ระบบทะเบียนออนไลน์", project: "ระบบทะเบียนออนไลน์", priority: "medium", done: false },
  { id: "td-3", title: "ตรวจไฟล์สรุปผล กิจกรรมพัฒนานักเรียน", project: "กิจกรรมพัฒนานักเรียน", priority: "low", done: true },
]

export type Role = "user" | "admin" | "planning" | "director" | "head";

export interface DemoUser {
  label: string;
  username: string;
  password: string;
  role: Role;
}

export const DEMO_USERS: DemoUser[] = [
  { label: "User (demo)", username: "demo",     password: "1234", role: "user" },
  { label: "Head (head)", username: "head",     password: "1234", role: "head" },
  { label: "Planning",    username: "plan",     password: "1234", role: "planning" },
  { label: "Director",    username: "director", password: "1234", role: "director" },
];

// username -> password
export const DEMO_PASSWORD_MAP: Record<string, string> =
  Object.fromEntries(DEMO_USERS.map(u => [u.username, u.password]));

// username -> role
export const ROLE_MAP: Record<string, Role> =
  Object.fromEntries(DEMO_USERS.map(u => [u.username, u.role]));

// helper สำหรับหน้า login
export function isValidMockLogin(username: string, password: string): boolean {
  return !!username && !!password && DEMO_PASSWORD_MAP[username] === password;
}
export function getRoleByUsername(username: string): Role {
  return ROLE_MAP[username] ?? "user";
}
