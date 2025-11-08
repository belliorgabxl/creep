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
  school: boolean;
  revenue: boolean;
  external: boolean;
  externalAgency: string;
};

// estimate component part
export type EstimateParams = {
  method: string;
  evaluator: string;
  period: string;
};

// general info component part
export type GeneralInfoParams = {
  name: string;
  type: string;
  department: string;
  owner: string;
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
export type ExpectParams = {
  result: string;
};
