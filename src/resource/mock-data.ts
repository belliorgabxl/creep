// mockProjects.ts

import { Project } from "@/dto/projectDto"

export const mockProjects: Project[] = [
  {
    id: "pj-001",
    name: "ระบบบริหารคลังสินค้า SOOK",
    owner: "ภัทรจาริน นภากาญจน์",
    role: "owner",
    status: "in_progress",
    progress: 60,
    updatedAt: new Date("2025-10-26T10:00:00Z").toISOString(),

    type: "Internal",
    department: "ฝ่ายพัฒนาโซลูชันธุรกิจ",
    durationMonths: 6,

    objective: "พัฒนาระบบจัดการคลังสินค้าภายในองค์กรให้สามารถตรวจสอบสต็อกได้แบบเรียลไทม์",

    kpis: [
      { name: "ลดระยะเวลาในการตรวจนับสต็อก", target: 30 },
      { name: "เพิ่มความถูกต้องของข้อมูลสินค้า", target: 99 },
    ],

    budget: 850000,

    qaIndicators: ["ระบบสารสนเทศมีประสิทธิภาพ", "กระบวนการทำงานเป็นมาตรฐาน"],
    strategies: ["ยุทธศาสตร์ด้านประสิทธิภาพองค์กร"],

    attachmentsCount: 3,
  },

  {
    id: "pj-002",
    name: "CareLink Platform",
    owner: "ภัทรจาริน นภากาญจน์",
    role: "assignee",
    status: "on_hold",
    progress: 35,
    updatedAt: new Date("2025-10-20T09:00:00Z").toISOString(),

    type: "External",
    department: "ทีมโครงการพิเศษ",
    durationMonths: 8,
    objective: "สร้างแพลตฟอร์มจับคู่ผู้ดูแลผู้สูงอายุ (Caregiver) กับลูกค้า",
    kpis: [
      { name: "เปิดตัว MVP ภายใน 8 เดือน" },
      { name: "ผู้ใช้ที่สมัครใช้งาน 1000 รายในไตรมาสแรก" },
    ],
    budget: 1200000,
    qaIndicators: ["การบริการผู้ใช้มีคุณภาพ"],
    strategies: ["ยุทธศาสตร์ด้านนวัตกรรมบริการ"],
    attachmentsCount: 2,
  },

  {
    id: "pj-003",
    name: "ระบบจัดการผลการเรียน OBAC",
    owner: "ภัทรจาริน นภากาญจน์",
    role: "owner",
    status: "done",
    progress: 100,
    updatedAt: new Date("2025-09-30T15:00:00Z").toISOString(),

    type: "Internal",
    department: "ฝ่ายพัฒนาซอฟต์แวร์",
    durationMonths: 5,
    objective: "ปรับปรุงระบบคำนวณเกรดและรายงานผลให้รองรับเกณฑ์ใหม่ของอาชีวศึกษา",
    kpis: [
      { name: "ลดเวลาการกรอกคะแนนของครูลง 50%" },
      { name: "ลดข้อผิดพลาดในการส่งเกรดลงต่ำกว่า 1%" },
    ],
    budget: 600000,
    qaIndicators: ["คุณภาพข้อมูลมีความถูกต้อง", "ระบบสารสนเทศมีความน่าเชื่อถือ"],
    strategies: ["ยุทธศาสตร์ด้านดิจิทัลเพื่อการศึกษา"],
    attachmentsCount: 4,
  },
]
