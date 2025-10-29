import { Project } from "@/dto/projectDto";

export const mockProjects: Project[] = [
  {
    id: "pj-001",
    name: "ระบบบริหารคลังสินค้า SOOK Report",
    owner: "ภัทรจาริน นภากาญจน์",
    role: "owner",
    status: "in_progress",
    progress: 60,
    updatedAt: new Date("2025-10-15T09:00:00Z").toISOString(),
  },
  {
    id: "pj-002",
    name: "CareLink Platform Report data",
    owner: "ภัทรจาริน นภากาญจน์",
    role: "assignee",
    status: "on_hold",
    progress: 30,
    updatedAt: new Date("2025-10-10T14:30:00Z").toISOString(),
  },
  {
    id: "pj-003",
    name: "ระบบจัดการผลการเรียน OBAC Report",
    owner: "ภัทรจาริน นภากาญจน์",
    role: "owner",
    status: "done",
    progress: 100,
    updatedAt: new Date("2025-09-25T18:00:00Z").toISOString(),
  },
]