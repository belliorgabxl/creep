import {
  ActivitiesRow,
  ApproveParams,
  BudgetTableValue,
  DateDurationValue,
  EstimateParams,
  ExpectParams,
  GeneralInfoParams,
  GoalParams,
  KPIParams,
  StrategyParams,
} from "@/dto/projectDto";

export const mockProject: {
  id: string;
  status: "draft" | "in_progress" | "on_hold" | "done";
  progress: number;
  updatedAt: string;

  generalInfo: GeneralInfoParams;
  strategy: StrategyParams;
  duration: DateDurationValue;
  budget: BudgetTableValue;
  activities: ActivitiesRow[];
  kpi: KPIParams;
  estimate: EstimateParams;
  expect: ExpectParams;
  approve: ApproveParams;
  goal: GoalParams;
} = {
  id: "mock-001",
  status: "in_progress",
  progress: 45,
  updatedAt: new Date().toISOString(),

  generalInfo: {
    name: "โครงการพัฒนาทักษะดิจิทัลนักศึกษา",
    type: "โครงการพิเศษ",
    department: "แผนกเทคโนโลยีสารสนเทศ",
    owner: "ภัทรจาริน นภากาญจน์",
  },

  strategy: {
    schoolPlan: "พัฒนานักศึกษาให้มีทักษะด้านเทคโนโลยีสารสนเทศขั้นสูง",
    ovEcPolicy: "ส่งเสริมทักษะอาชีพสู่มาตรฐานสากล",
    qaIndicator: "มาตรฐานที่ 1 ตัวบ่งชี้ที่ 1.2",
  },

  duration: {
    startDate: "2025-06-01",
    endDate: "2025-12-31",
    durationMonths: 6,
  },

  budget: {
    total: 180000,
    sources: {
      school: true,
      revenue: false,
      external: true,
      externalAgency: "กระทรวงดิจิทัลเพื่อเศรษฐกิจและสังคม",
    },
    rows: [
      { id: 1, item: "จัดอบรมพื้นฐาน", amount: "50000", note: "" },
      { id: 2, item: "อุปกรณ์ฝึกปฏิบัติ", amount: "80000", note: "" },
      { id: 3, item: "สื่อการเรียนรู้และเอกสาร", amount: "50000", note: "" },
    ],
  },

  activities: [
    { id: 1, activity: "ประชุมวางแผนงาน", period: "1-10 มิ.ย. 68", owner: "ฝ่ายบริหาร" },
    { id: 2, activity: "จัดอบรมหลักสูตร", period: "15 มิ.ย. - 30 ก.ค. 68", owner: "อ.กิตติศักดิ์" },
    { id: 3, activity: "ประเมินผลผู้เข้าร่วม", period: "1-5 ส.ค. 68", owner: "อ.ภัทรจาริน" },
  ],

  kpi: {
    output: "นักศึกษาผ่านการอบรมอย่างน้อย 100 คน",
    outcome: "นักศึกษา 80% สามารถนำทักษะไปใช้จริงในสถานประกอบการ",
  },

  estimate: {
    method: "แบบสอบถาม",
    evaluator: "อ.นฤมล พิชิต",
    period: "ส.ค. - ก.ย. 68",
  },

  expect: {
    result: "นักศึกษามีความรู้ความเข้าใจและสามารถประยุกต์ใช้เทคโนโลยีในชีวิตประจำวันและการทำงาน",
  },

  approve: {
    proposerName: "ภัทรจาริน นภากาญจน์",
    proposerPosition: "หัวหน้าโครงการ",
    proposeDate: "2025-05-30",
    deptComment: "เห็นสมควรให้ดำเนินการตามแผน",
    directorComment: "อนุมัติให้ดำเนินการ",
  },

  goal: {
    quantityGoal: "อบรมผู้เข้าร่วม 100 คนต่อปี",
    qualityGoal: "ผู้เข้าร่วม 80% ผ่านเกณฑ์ความรู้หลังอบรม",
  },
};