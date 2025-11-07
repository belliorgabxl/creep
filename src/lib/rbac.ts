export type RoleKey =
  | "department_user"
  | "department_head"
  | "planning"
  | "director"
  | "admin"
  | "hr";

export type Permission =
  | "budget:create:self-department"
  | "budget:approve:department"
  | "budget:approve:org"
  | "system:manage"
  | "hr:manage";

export const ROLE_PERMISSIONS: Record<RoleKey, Permission[]> = {
  department_user: ["budget:create:self-department"],
  department_head: ["budget:create:self-department", "budget:approve:department"],
  planning: ["budget:approve:org"],
  director: ["budget:approve:org"],
  admin: ["budget:create:self-department", "budget:approve:department", "budget:approve:org", "system:manage", "hr:manage"],
  hr: ["hr:manage"],
};

export function hasPermission(role: RoleKey, perm: Permission) {
  const list = ROLE_PERMISSIONS[role] || [];
  return list.includes(perm);
}
