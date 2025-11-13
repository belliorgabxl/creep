export type GetCalenderEventRespond = {
  id: string;
  title: string;
  start_date: Date | string;
  plan_id?: string;
  end_date?: Date | string;
  department?: string;
  status?: string;
};

export const initialCalendarEvents: GetCalenderEventRespond[] = [];

export type GetProjectsByOrgRespond = {
  id: string;
  name: string;
  code?: string;
  department_id?: string;
  description?: string;
  location?: string;
  organization_id?: string;
  owner_user_id?: string;
  plan_type?: 'regular_work' | string;
  qualitative_goal?: string;
  quantitative_goal?: string;
  rationale?: string;
  regular_work_template_id?: string;
  start_date?: string | Date;
  end_date?: string | Date;
  updated_by?: string;
};

export const initialProjectsByOrg: GetProjectsByOrgRespond[] = [];