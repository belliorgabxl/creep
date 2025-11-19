export interface Project {
  id: string;
  name: string;
  owner: string;
  role?: string;
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
  id: string;
  code: string;
  name: string;
  head?: string;
  employees?: number;
  projectsCount?: number;
  updatedAt?: string;
};

export type TdProps = React.TdHTMLAttributes<HTMLTableCellElement> & {
  className?: string;
  children: React.ReactNode;
};

// duration component part

export type DateDurationValue = {
  startDate: string;
  endDate: string;
  durationMonths: number;
};

// budget component part
export type BudgetTableValue = {
  rows: BudgetRow[];
  total: number;
  sources: FundingSources;
};
export type BudgetRow = {
  id: number;
  item: string;
  amount: string;
  note: string;
};

export type FundingSources = {
  source: "school" | "revenue" | "external" | "";
  externalAgency: string;
};

// estimate component part
export type EstimateParams = {
  estimateType: string;
  evaluator: string;
  startDate: string;
  endDate: string;
};

// general info component part
export type GeneralInfoParams = {
  name: string;
  type: string;
  department_id: string;
  owner_user_id: string;
};

// strategy component part
export type StrategyParams = {
  schoolPlan: string;
  ovEcPolicy: string;
  qaIndicator: string;
};

// approve component part
export type ApproveParams = {
  proposerName: string;
  proposerPosition: string;
  proposeDate: string;
  deptComment: string;
  directorComment: string;
};

// goal component part
export type GoalParams = {
  quantityGoal: string;
  qualityGoal: string;
};

// activity component part
export type ActivitiesRow = {
  id: number;
  activity: string;
  period: string;
  owner: string;
};

// kpi component part
export type KPIParams = {
  output: string;
  outcome: string;
};

// expect part
export type ExpectItem = {
  description: string;
  type: string;
};
export type ExpectParams = {
  results: ExpectItem[];
};

export interface CreateProjectPayload {
  code?: string;
  department_id: string;
  description: string;
  end_date: string;
  location: string;
  name: string;
  organization_id: string;
  owner_user_id: string;
  plan_type: string;
  qualitative_goal: string;
  quantitative_goal: string;
  rationale: string;
  start_date: string;
  updated_by: string;
}
