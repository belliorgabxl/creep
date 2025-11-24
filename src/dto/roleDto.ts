export interface RoleRespond {
  id: number;
  name: string;
  display_name: string;
  code: string;
  description?: string | null;
  approval_level?: number | null;
  is_system_role?: boolean;
  is_active?: boolean;
  organization_id?: string | null;
  can_create_budget_plan?: boolean;
  can_view_all_plans?: boolean;
  can_approve?: boolean;
  can_edit_qas?: boolean;
  created_at?: string | null; // ISO timestamp
  updated_at?: string | null; // ISO timestamp
  created_by?: string | null;
  updated_by?: string | null;
}
