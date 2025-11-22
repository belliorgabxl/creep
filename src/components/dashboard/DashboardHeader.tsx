"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, User, ChevronDown, Bell, LogOut, Settings } from "lucide-react";

interface DashboardHeaderProps {
  filters: { year: string; department: string }
  onFilterChange: (key: string, value: string) => void
}

export function DashboardHeader({ filters, onFilterChange }: DashboardHeaderProps) {
  const router = useRouter();

  const years = ["2566", "2567", "2568", "2569"];
  const departments = [
    { value: "all", label: "ทุกหน่วยงาน" },
    { value: "plan", label: "ฝ่ายแผน" },
    { value: "academic", label: "วิชาการ" },
    { value: "finance", label: "การเงิน" },
    { value: "registry", label: "ทะเบียน" },
    { value: "student", label: "กิจการนักเรียน" },
  ];

  const [openProfile, setOpenProfile] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const getCookie = (name: string) =>
      document.cookie
        .split("; ")
        .find((c) => c.startsWith(name + "="))
        ?.split("=")[1] || null;

    setUsername(getCookie("mock_uid"));
    setRole(getCookie("mock_role"));
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setOpenProfile(false);
      }
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenProfile(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  function handleLogout() {
    document.cookie = `mock_uid=; Path=/; Max-Age=0; SameSite=Lax`;
    document.cookie = `mock_role=; Path=/; Max-Age=0; SameSite=Lax`;
    localStorage.removeItem("ebudget_login");
    router.replace("/login");
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-white/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-700 shadow-md">
                <span className="text-sm font-bold text-white">EB</span>
              </div>
              <h1 className="text-xl font-semibold tracking-tight text-gray-900">E-Budget</h1>
            </div>
            <div className="hidden items-center gap-2 md:flex">
              <div className="relative">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-100"
                >
                  <span>ปีงบประมาณ {filters.year}</span>
                  <ChevronDown className="h-4 w-4 opacity-60" />
                </button>
                <div className="absolute mt-2 hidden w-48 rounded-md border border-gray-200 bg-white p-1.5 text-sm shadow-lg focus-within:block group-hover:block md:group">
                  {years.map((year) => (
                    <button
                      key={year}
                      onClick={() => onFilterChange("year", year)}
                      className={`block w-full cursor-pointer rounded px-2 py-1.5 text-left hover:bg-gray-100 ${
                        year === filters.year ? "text-gray-900 font-medium" : "text-gray-700"
                      }`}
                    >
                      ปีงบประมาณ {year}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-100"
                >
                  <span>{departments.find((d) => d.value === filters.department)?.label}</span>
                  <ChevronDown className="h-4 w-4 opacity-60" />
                </button>
                <div className="absolute mt-2 hidden w-56 rounded-md border border-gray-200 bg-white p-1.5 text-sm shadow-lg focus-within:block group-hover:block md:group">
                  {departments.map((dept) => (
                    <button
                      key={dept.value}
                      onClick={() => onFilterChange("department", dept.value)}
                      className={`block w-full cursor-pointer rounded px-2 py-1.5 text-left hover:bg-gray-100 ${
                        dept.value === filters.department ? "text-gray-900 font-medium" : "text-gray-700"
                      }`}
                    >
                      {dept.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative hidden sm:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                placeholder="ค้นหาโครงการ..."
                className="w-64 rounded-md border border-gray-200 bg-gray-50 pl-9 pr-3 py-2 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:bg-white focus:outline-none"
              />
            </div>

            <button className="relative rounded-md p-2 hover:bg-gray-100" aria-label="Notifications">
              <Bell className="h-5 w-5 text-gray-700" />
              <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-red-600 text-xs font-medium text-white">
                3
              </span>
            </button>
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setOpenProfile((v) => !v)}
                className="grid h-8 w-8 place-items-center rounded-full bg-gray-700 text-white hover:opacity-90"
                aria-haspopup="menu"
                aria-expanded={openProfile}
              >
                <User className="h-4 w-4" />
              </button>

              {openProfile && (
                <div
                  role="menu"
                  aria-label="Profile menu"
                  className="absolute right-0 mt-2 w-60 rounded-lg border border-gray-200 bg-white p-2 text-sm shadow-lg"
                >
                  <div className="px-3 pb-2 pt-1">
                    <p className="truncate text-gray-900 font-medium">
                      {username ? username : "ผู้ใช้ระบบ"}
                    </p>
                    <p className="text-gray-500 text-xs">{role ? role : "role: user"}</p>
                  </div>
                  <hr className="my-2" />
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      router.push("/user/profile");
                      setOpenProfile(false);
                    }}
                  >
                    <Settings className="h-4 w-4" />
                    ตั้งค่าโปรไฟล์
                  </button>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-red-600 hover:bg-red-50"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    ออกจากระบบ
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
