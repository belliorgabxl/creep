"use client";

import React, { useState } from "react";
import UsersTable from "@/components/user/UserTable";

import AddUserModal from "./AddUserModal";
import UserDetailsModal from "./UserDetailsModal";

// -------------------- Mock data --------------------
const ORG = {
  id: "ORG-001",
  name: "Example Org",
  quota: 130,
};

const INITIAL_USERS = [
  { id: "EMP-101", name: "Apinya S.", title: "HR Manager", department: "HR", status: "On leave", isActive: false, createdAt: "2024-03-12" },
  { id: "EMP-102", name: "Somchai K.", title: "Engineer", department: "Engineering", status: "Active", isActive: true, createdAt: "2023-10-01" },
  { id: "EMP-103", name: "Ploy J.", title: "Recruiter", department: "HR", status: "Active", isActive: true, createdAt: "2025-01-20" },
];

function uid(prefix = "U") {
  return `${prefix}-${Math.floor(Math.random() * 10000)}`;
}
function statusLabel(user: any) {
  if (!user?.isActive) return "ระงับการใช้งาน";
  if (user.status === "On leave") return "ลาหยุด";
  return "ใช้งาน";
}

export default function ManageUsersPage() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [editing, setEditing] = useState<any | null>(null);
  const [detailsUser, setDetailsUser] = useState<any | null>(null);
  const [filter, setFilter] = useState("all");

  // modal state
  const [addOpen, setAddOpen] = useState(false);

  const currentCount = users.length;

  const handleAdd = (u: any) => {
    const newUser = { id: uid("EMP"), ...u, isActive: u.status !== "Inactive", createdAt: new Date().toISOString().slice(0,10) };
    setUsers((prev) => [newUser, ...prev]);
  };

  const handleSaveEdit = () => {
    if (!editing) return;
    setUsers((prev) => prev.map((x) => (x.id === editing.id ? { ...editing } : x)));
    setEditing(null);
  };

  const toggleIsActive = (id: string) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, isActive: !u.isActive } : u)));
  };

  const filtered = users.filter((u) => {
    if (filter === "all") return true;
    if (filter === "active") return u.isActive === true;
    return u.isActive === false;
  });

  return (
    <div className="p-6 space-y-6 text-gray-800">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">จัดการผู้ใช้งาน</h1>
          <div className="text-sm text-gray-500">องค์กร: {ORG.name}</div>
        </div>

        <div className="text-sm text-gray-600">สรุป: <span className="font-medium">{currentCount}</span> / <span className="font-medium">{ORG.quota}</span> ผู้ใช้</div>
      </header>

      <div className="bg-white p-4 rounded-lg shadow-sm grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
          {/* you can keep a small quick-add button here */}
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => setAddOpen(true)} className="px-3 py-2 bg-indigo-600 text-white rounded text-sm shadow-sm">เพิ่มพนักงาน</button>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="border p-2 rounded text-sm">
            <option value="all">ทั้งหมด</option>
            <option value="active">ใช้งาน</option>
            <option value="inactive">ระงับการใช้งาน</option>
          </select>
        </div>
      </div>

      <UsersTable
        users={filtered}
        org={ORG}
        onToggleIsActive={toggleIsActive}
        onEdit={(u) => setEditing(u)}
        onDetails={(u) => setDetailsUser(u)}
      />

      {/* edit drawer */}
      {editing && (
        <div className="fixed inset-0 flex items-end md:items-center justify-center p-4">
          <div className="w-full md:w-1/2 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-3">แก้ไขพนักงาน</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="border p-2 rounded text-sm" />
              <input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="border p-2 rounded text-sm" />
              <input value={editing.department} onChange={(e) => setEditing({ ...editing, department: e.target.value })} className="border p-2 rounded text-sm" />
              <select value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value })} className="border p-2 rounded text-sm">
                <option>Active</option>
                <option>On leave</option>
              </select>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setEditing(null)} className="px-3 py-2 border rounded">ยกเลิก</button>
              <button onClick={handleSaveEdit} className="px-3 py-2 bg-indigo-600 text-white rounded">บันทึก</button>
            </div>
          </div>
        </div>
      )}

      <AddUserModal open={addOpen} onClose={() => setAddOpen(false)} onAdd={handleAdd} />

      <UserDetailsModal open={!!detailsUser} user={detailsUser} onClose={() => setDetailsUser(null)} statusLabel={statusLabel} />

      <footer className="text-xs text-gray-400">Mock implementation — ปรับเชื่อม API / เปลี่ยนคำศัพท์ได้ตามต้องการ</footer>
    </div>
  );
}
