export interface User {
  id: string;
  organization_id: string;
  department_id: string | null;
  role: string;
  username: string;
  email: string;
  position: string;
  first_name: string;
  last_name: string;
  full_name: string;
  last_login_at: string | null;
}
export interface AuthUser {
  id: string;
  username: string;
  name: string;
  role_key: string | null;
  role_id: string | null;
  role_label: string | null;
  org_id: string | null;
  department_id: string | null;
}
export interface AuthMeResponse {
  authenticated: boolean;
  message?: string;
  user?: AuthUser;
}