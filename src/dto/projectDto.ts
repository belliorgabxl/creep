export interface Project {
  id: string;
  name: string;
  owner: string;
  role?: "owner" | "assignee" | "viewer";
  status: "draft" | "in_progress" | "on_hold" | "done";
  progress: number;
  updatedAt: string;
  type?: "Internal" | "External" | string;
  department?: string;
  durationMonths?: number;
  objective?: string;
  kpis?: { name: string; target?: number }[];
  budget?: number;
  qaIndicators?: string[];
  strategies?: string[];
  attachmentsCount?: number;
}

export type Department = {
  id: string
  code: string
  name: string
  head?: string
  employees?: number
  projectsCount?: number
  updatedAt?: string
}
