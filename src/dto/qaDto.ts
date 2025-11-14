
export type GetQaIndicatorsRespond = {
  id: string;
  name: string;
  code: string;
  display_order: number;
  description: string;
  organization_id: string;
  year: number;
};

export type GetQaIndicatorsByYearRespond = {
  id: string;
  name: string;
  code: string;
  count_projects: number;
  year: number;
  status: number;
};

export type GetQaIndicatorsCountsByYear = {
  qa_count: number;
  spaces_project_count: number;
  total_project_count: number;
  year: number;
};

export type GetQaIndicatorsDetailsRespond = {
  id: string;
  budget_plan_count: number;
  code: string;
  description: string;
  display_order: number;
  name: string;
  organization_id: string;
  project_count: number;
  year: number;
};

export type GetStrategicPlanRespond = {
  id: string;
  name: string;
  description: string;
  count: number;
  organization_id: string;
  year_end: string;
  year_start: string;
};


export type QaRequest = {
  code: string;
  description: string;
  display_order: number;
  name: string;
  organization_id: string;
  year: number;
};

