// app/(protected)/user/page.tsx
"use client";

import React from "react";

// Single-file Page: HR KPIs + Department Table + User Table
// Contains only: HrKpiCards, DepartmentTable, UserTable and mock data.

const MOCK = {
  year: "2568",
  kpis: {
    headcount: 128,
    quotaRemaining: 12, // โควตาพนักงานที่ยังว่าง หรือ จำนวนโควตาพนักงานคงเหลือ
    departments: 8,
  },
  departments: [
    {
      code: "ACA",
      name: "ฝ่ายวิชาการ",
      leader: "อาจารย์ศิริพร ทองสุก",
      employees: 20,
      projects: 8,
      updatedAt: "25/10/2568",
    },
    // เพิ่มตัวอย่างเพิ่มเติมตามต้องการ
  ],
  users: [
    { name: "Apinya S.", title: "HR Manager", department: "HR", status: "On leave" },
    // เพิ่มผู้ใช้ตัวอย่างได้
  ],
};

// -------------------- Components --------------------

function HrKpiCards({ kpis }: { kpis: any }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Card: Headcount */}
      <div className="p-4 bg-white rounded-lg shadow-sm">
        <div className="text-xs text-gray-500">จำนวนพนักงาน</div>
        <div className="mt-2 text-2xl font-semibold text-gray-800">{kpis.headcount}</div>
        <div className="mt-1 text-sm text-gray-400">รวมพนักงานทั้งหมดในองค์กร</div>
      </div>

      {/* Card: Quota Remaining */}
      <div className="p-4 bg-white  rounded-lg shadow-sm">
        <div className="text-xs text-gray-500">โควตาพนักงานคงเหลือ</div>
        <div className="mt-2 text-2xl font-semibold text-indigo-600">{kpis.quotaRemaining}</div>
        <div className="mt-1 text-sm text-gray-400">ตำแหน่งที่เปิดรับ/โควต้ายังว่าง</div>
      </div>

      {/* Card: Departments */}
      <div className="p-4 bg-white rounded-lg shadow-sm">
        <div className="text-xs text-gray-500">จำนวนแผนก</div>
        <div className="mt-2 text-2xl font-semibold text-green-600">{kpis.departments}</div>
        <div className="mt-1 text-sm text-gray-400">หน่วยงาน / ฝ่าย ภายในองค์กร</div>
      </div>
    </div>
  );
}

function DepartmentTable({ departments }: { departments: any[] }) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 text-left">
          <tr>
            <th className="p-3">รหัส</th>
            <th className="p-3">ชื่อหน่วยงาน</th>
            <th className="p-3">หัวหน้าหน่วยงาน</th>
            <th className="p-3">พนักงาน</th>
            <th className="p-3">โปรเจ็กต์</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((d) => (
            <tr key={d.code} className="border-t hover:bg-gray-50">
              <td className="p-3 font-medium">{d.code}</td>
              <td className="p-3">{d.name}</td>
              <td className="p-3">{d.leader}</td>
              <td className="p-3">{d.employees}</td>
              <td className="p-3">{d.projects}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function UserTable({ users }: { users: any[] }) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 text-left">
          <tr>
            <th className="p-3">ชื่อ</th>
            <th className="p-3">ตำแหน่ง</th>
            <th className="p-3">แผนก</th>
            <th className="p-3">สถานะ</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, i) => (
            <tr key={i} className="border-t hover:bg-gray-50">
              <td className="p-3 font-medium">{u.name}</td>
              <td className="p-3">{u.title}</td>
              <td className="p-3">{u.department}</td>
              <td className={`p-3 font-medium ${u.status === 'On leave' ? 'text-yellow-600' : u.status === 'Active' ? 'text-green-600' : 'text-gray-500'}`}>{u.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// -------------------- Page --------------------
export default function UserDashboardPage() {
  return (
    <div className="p-6 space-y-6 text-gray-800">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">HR Dashboard</h1>
          <div className="text-sm text-gray-500">ปีงบประมาณ {MOCK.year}</div>
        </div>
        <div className="text-sm text-gray-400">Updated: 2025-11-18</div>
      </header>

      <HrKpiCards kpis={MOCK.kpis} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-medium mb-3">หน่วยงาน</h2>
          <DepartmentTable departments={MOCK.departments} />
        </div>

        <div>
          <h2 className="text-lg font-medium mb-3">พนักงาน</h2>
          <UserTable users={MOCK.users} />
        </div>
      </div>
    </div>
  );
}
