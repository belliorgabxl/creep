export type GetApprovalItems = {
  budget_id: string;
  amount: number;
  dept: string;
  owner: string;
  last_update: Date | string;
  priority: number;
  project: string;
  stage: string;
};

export const initialApprovalItems: GetApprovalItems[] = [];

