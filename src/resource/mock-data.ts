import { Department, Project } from "@/dto/projectDto";

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

    objective:
      "พัฒนาระบบจัดการคลังสินค้าภายในองค์กรให้สามารถตรวจสอบสต็อกได้แบบเรียลไทม์",

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
    objective:
      "ปรับปรุงระบบคำนวณเกรดและรายงานผลให้รองรับเกณฑ์ใหม่ของอาชีวศึกษา",
    kpis: [
      { name: "ลดเวลาการกรอกคะแนนของครูลง 50%" },
      { name: "ลดข้อผิดพลาดในการส่งเกรดลงต่ำกว่า 1%" },
    ],
    budget: 600000,
    qaIndicators: [
      "คุณภาพข้อมูลมีความถูกต้อง",
      "ระบบสารสนเทศมีความน่าเชื่อถือ",
    ],
    strategies: ["ยุทธศาสตร์ด้านดิจิทัลเพื่อการศึกษา"],
    attachmentsCount: 4,
  },
];

export const mockDepartments: Department[] = [
  {
    id: "dep-001",
    code: "ACA",
    name: "ฝ่ายวิชาการ",
    head: "อาจารย์ศิริพร ทองสุก",
    employees: 20,
    projectsCount: 8,
    updatedAt: "2025-10-25T09:00:00Z",
  },
  {
    id: "dep-002",
    code: "STD",
    name: "ฝ่ายกิจการนักเรียน",
    head: "ครูวรรณา มณีโชติ",
    employees: 15,
    projectsCount: 5,
    updatedAt: "2025-10-23T13:30:00Z",
  },
  {
    id: "dep-003",
    code: "FIN",
    name: "ฝ่ายการเงินและบัญชี",
    head: "นางสาวธนาภรณ์ สุนทรพงศ์",
    employees: 10,
    projectsCount: 6,
    updatedAt: "2025-10-21T08:45:00Z",
  },
  {
    id: "dep-004",
    code: "HR",
    name: "ฝ่ายทรัพยากรบุคคล",
    head: "นายอดิศักดิ์ ใจงาม",
    employees: 9,
    projectsCount: 4,
    updatedAt: "2025-10-18T10:15:00Z",
  },
  {
    id: "dep-005",
    code: "ADM",
    name: "ฝ่ายธุรการและสารบรรณ",
    head: "นางสาวจิราภรณ์ รัตนวรรณ",
    employees: 7,
    projectsCount: 3,
    updatedAt: "2025-10-20T14:00:00Z",
  },
  {
    id: "dep-006",
    code: "MKT",
    name: "ฝ่ายประชาสัมพันธ์และการตลาด",
    head: "นางสาวพิมพ์ชนก นาคสวัสดิ์",
    employees: 6,
    projectsCount: 2,
    updatedAt: "2025-10-27T12:10:00Z",
  },
  {
    id: "dep-007",
    code: "IT",
    name: "ฝ่ายเทคโนโลยีสารสนเทศ",
    head: "นายภูมิพัฒน์ อินทร์สุข",
    employees: 5,
    projectsCount: 4,
    updatedAt: "2025-10-24T11:30:00Z",
  },
  {
    id: "dep-008",
    code: "QAS",
    name: "ฝ่ายประกันคุณภาพการศึกษา",
    head: "ครูสุภาวดี จันทร์เพ็ญ",
    employees: 4,
    projectsCount: 5,
    updatedAt: "2025-10-26T09:20:00Z",
  },
  {
    id: "dep-009",
    code: "LIB",
    name: "ฝ่ายห้องสมุดและสื่อการเรียนรู้",
    head: "ครูรัตนาภรณ์ อินทร์แก้ว",
    employees: 3,
    projectsCount: 1,
    updatedAt: "2025-10-19T15:10:00Z",
  },
  {
    id: "dep-010",
    code: "SEC",
    name: "ฝ่ายรักษาความปลอดภัยและอาคารสถานที่",
    head: "นายสุนทร บุญมี",
    employees: 8,
    projectsCount: 2,
    updatedAt: "2025-10-17T09:40:00Z",
  },
];

export const mockOne: Project = {
  id: "pj-001",
  name: "ระบบบริหารคลังสินค้า SOOK",
  owner: "ภัทรจาริน นภากาญจน์",
  role: "owner",
  status: "in_progress",
  progress: 60,
  updatedAt: new Date().toISOString(),
  type: "Internal",
  department: "ฝ่ายวิชาการ",
  durationMonths: 6,
  objective: "พัฒนาระบบติดตามสต็อกแบบเรียลไทม์ ลดเวลาและข้อผิดพลาด",
  kpis: [
    { name: "ลดเวลาตรวจนับสต็อก", target: 30 },
    { name: "ความถูกต้องข้อมูล", target: 99 },
  ],
  budget: 850_000,
  qaIndicators: ["ระบบสารสนเทศมีประสิทธิภาพ", "กระบวนการทำงานเป็นมาตรฐาน"],
  strategies: ["ยุทธศาสตร์ด้านประสิทธิภาพองค์กร"],
  attachmentsCount: 3,
}
