export interface Department {
  id: string;
  code: string;
  name: string;
  organization_id: string;
  is_archived: boolean;
  project_count : number;
  user_count : number;
  is_active :boolean;
}