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
  source:string;
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
  startDate: string;
  endDate: string;
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

export type ObjectiveParams = {
  results: {
    description: string;
    type?: "objective";
  }[];
};

export interface ProjectInformationResponse {
  project_name: string;
  plane_type: string;
  rationale: string;
  location: string;
  quantitative_goal: string;
  qualitative_goal: string;
  created_at: string;
  updated_at: string;
  department_name: string;
  budget_source: string;
  budget_amount: number;
  budget_source_department: string;
  budget_items: {
    id: number;
    budget_plan_id: string;
    name: string;
    amount: number;
    remark: string;
    created_at: string;
    updated_at: string;
  }[];
  progress: {
    id: number;
    project_id: string;
    start_date: string | null;
    end_date: string | null;
    sequence_number: number;
    description: string;
    responsible_name: string;
    remarks: string;
    updated_by: string | null;
    updated_at: string;
  }[];
}
