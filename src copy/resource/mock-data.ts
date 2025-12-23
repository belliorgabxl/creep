import { Department, Project } from "@/dto/projectDto";

export const mockProjects: Project[] = [
  {
    id: "pj-001",
    name: "โครงการพัฒนาทักษะดิจิทัลนักศึกษา",
    owner: "ภัทรจาริน นภากาญจน์",
    role: "หัวหน้าโครงการ",
    status: "in_progress",
    progress: 60,
    updatedAt: new Date("2025-10-26T10:00:00Z").toISOString(),

    type: "โครงการพิเศษ",
    department: "แผนกเทคโนโลยีสารสนเทศ",
    durationMonths: 6,

    objective:
      "พัฒนาทักษะการใช้เทคโนโลยีดิจิทัลสำหรับนักศึกษา เพื่อเตรียมพร้อมสู่ตลาดแรงงานยุคใหม่",

    kpis: [
      { name: "นักศึกษาผ่านการอบรมครบตามหลักสูตร", target: 100 },
      { name: "นักศึกษานำความรู้ไปใช้จริง", target: 80 },
    ],

    budget: 180000,

    qaIndicators: ["มาตรฐานที่ 1 ตัวบ่งชี้ 1.2", "มาตรฐานที่ 2 ตัวบ่งชี้ 2.1"],
    strategies: [
      "เพิ่มขีดความสามารถทางดิจิทัล",
      "ส่งเสริมการเรียนรู้ตลอดชีวิต",
    ],

    attachmentsCount: 3,
  },
  {
    id: "pj-002",
    name: "โครงการส่งเสริมการอ่านภาษาอังกฤษ",
    owner: "อ.กิตติศักดิ์ บุญช่วย",
    role: "ผู้รับผิดชอบโครงการ",
    status: "draft",
    progress: 25,
    updatedAt: new Date("2025-09-15T08:30:00Z").toISOString(),

    type: "แผนงานประจำ",
    department: "แผนกภาษาต่างประเทศ",
    durationMonths: 3,

    objective:
      "สร้างสภาพแวดล้อมแห่งการเรียนรู้ภาษาอังกฤษผ่านกิจกรรมการอ่านและสื่อมัลติมีเดีย",

    kpis: [
      { name: "นักเรียนเข้าร่วมกิจกรรม", target: 50 },
      { name: "คะแนนเฉลี่ยการอ่านเพิ่มขึ้น", target: 10 },
    ],

    budget: 50000,

    qaIndicators: ["มาตรฐานที่ 3 ตัวบ่งชี้ 3.1"],
    strategies: ["พัฒนาทักษะภาษาเพื่อการสื่อสารสากล"],

    attachmentsCount: 1,
  },
  {
    id: "pj-003",
    name: "โครงการฝึกอบรมการใช้ซอฟต์แวร์บัญชี",
    owner: "อ.ธิดารัตน์ ศรีสวัสดิ์",
    role: "หัวหน้าโครงการ",
    status: "done",
    progress: 100,
    updatedAt: new Date("2025-08-10T14:20:00Z").toISOString(),

    type: "โครงการพัฒนา",
    department: "แผนกการบัญชี",
    durationMonths: 4,

    objective:
      "ให้นักเรียนมีความเข้าใจในการใช้ซอฟต์แวร์บัญชีที่ใช้จริงในสถานประกอบการ",

    kpis: [
      { name: "นักเรียนผ่านการประเมินหลังอบรม", target: 90 },
      { name: "สถานประกอบการให้คะแนนพึงพอใจ", target: 85 },
    ],

    budget: 120000,

    qaIndicators: ["มาตรฐานที่ 1 ตัวบ่งชี้ 1.3"],
    strategies: ["ยกระดับการเรียนรู้เชิงปฏิบัติการ"],

    attachmentsCount: 5,
  },
  {
    id: "pj-004",
    name: "โครงการอนุรักษ์สิ่งแวดล้อมในวิทยาลัย",
    owner: "อ.นฤมล สายธาร",
    role: "ผู้ประสานงานโครงการ",
    status: "on_hold",
    progress: 40,
    updatedAt: new Date("2025-09-28T09:00:00Z").toISOString(),

    type: "โครงการจิตอาสา",
    department: "กิจการนักศึกษา",
    durationMonths: 2,

    objective:
      "ส่งเสริมการมีส่วนร่วมของนักศึกษาในการอนุรักษ์สิ่งแวดล้อมภายในสถานศึกษา",

    kpis: [
      { name: "จำนวนนักศึกษาเข้าร่วมกิจกรรม", target: 200 },
      { name: "ลดปริมาณขยะในพื้นที่ 20%", target: 20 },
    ],

    budget: 35000,

    qaIndicators: ["มาตรฐานที่ 5 ตัวบ่งชี้ 5.1"],
    strategies: ["สร้างสำนึกอนุรักษ์สิ่งแวดล้อม"],

    attachmentsCount: 2,
  },
  {
    id: "pj-005",
    name: "โครงการฝึกอบรมความปลอดภัยในการทำงาน",
    owner: "อ.สมชาย วิริยะกิจ",
    role: "หัวหน้าแผนกช่างกลโรงงาน",
    status: "in_progress",
    progress: 70,
    updatedAt: new Date("2025-11-05T15:45:00Z").toISOString(),

    type: "โครงการฝึกอบรม",
    department: "ช่างกลโรงงาน",
    durationMonths: 5,

    objective: "สร้างจิตสำนึกความปลอดภัยให้แก่นักเรียนและบุคลากรภายในวิทยาลัย",

    kpis: [
      { name: "ผู้เข้าอบรมผ่านการทดสอบความรู้", target: 95 },
      { name: "ลดอุบัติเหตุในพื้นที่ปฏิบัติงาน", target: 100 },
    ],

    budget: 95000,

    qaIndicators: ["มาตรฐานที่ 4 ตัวบ่งชี้ 4.2"],
    strategies: ["พัฒนาความปลอดภัยในสถานศึกษา"],

    attachmentsCount: 4,
  },
  {
    id: "pj-006",
    name: "โครงการพัฒนาเว็บไซต์ประชาสัมพันธ์วิทยาลัย",
    owner: "อ.วรพล อินทรา",
    role: "หัวหน้าฝ่ายสารสนเทศ",
    status: "draft",
    progress: 10,
    updatedAt: new Date("2025-10-10T12:00:00Z").toISOString(),

    type: "โครงการเทคโนโลยีสารสนเทศ",
    department: "ฝ่ายสารสนเทศและประชาสัมพันธ์",
    durationMonths: 3,

    objective:
      "จัดทำเว็บไซต์เพื่อเผยแพร่ข่าวสารและผลงานของนักศึกษา รวมถึงการประชาสัมพันธ์กิจกรรมของวิทยาลัย",

    kpis: [
      { name: "เว็บไซต์ออนไลน์ใช้งานได้ภายในกำหนด", target: 1 },
      { name: "จำนวนผู้เข้าชมเฉลี่ยต่อเดือน", target: 1000 },
    ],

    budget: 78000,

    qaIndicators: ["มาตรฐานที่ 2 ตัวบ่งชี้ 2.3"],
    strategies: ["เพิ่มประสิทธิภาพการสื่อสารภายในองค์กร"],

    attachmentsCount: 0,
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
