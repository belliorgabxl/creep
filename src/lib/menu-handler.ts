import {
  LayoutDashboard,
  Building2,
  Settings,
  TrendingUp,
  ClipboardList,
} from "lucide-react";

export type RoleKey =
  | "department_user"
  | "department_head"
  | "planning"
  | "director"
  | "admin"
  | "hr";

export type MenuItem = {
  id: string;
  href: string | ((roleHome: string | null) => string | null);
  icon: any;
  label: string;
  allow?: RoleKey[];
  deny?: RoleKey[];
};

export const MENU: MenuItem[] = [
  {
    id: "dashboard",
    href: (roleHome) => roleHome,
    icon: LayoutDashboard,
    label: "ภาพรวม",
    allow: [
      "hr",
      "department_user",
      "department_head",
      "planning",
      "director",
      "admin",
    ],
  },
  {
    id: "department",
    href: "/organizer/department",
    icon: Building2,
    label: "หน่วยงาน",
    allow: ["hr", "admin"],
  },
  {
    id: "projects",
    href: "/organizer/projects/my-project",
    icon: ClipboardList,
    label: "โครงการ",
    allow: [
      "department_user",
      "department_head",
      "planning",
      "director",
      "admin",
    ],
  },
  {
    id: "reports",
    href: "/organizer/reports",
    icon: TrendingUp,
    label: "รายงาน",
    allow: ["planning", "director", "admin"],
  },
  {
    id: "setup",
    href: "/organizer/setup",
    icon: Settings,
    label: "ตั้งค่า",
    allow: ["hr", "admin"],
  },
];
export const canSeeMenuHandler = (role: RoleKey, item: MenuItem) => {
  if (item.deny?.includes(role)) return false;
  if (!item.allow) return true;
  return item.allow.includes(role);
};
