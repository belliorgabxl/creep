"use client";

import React, { useEffect, useState } from "react";
import UsersTable from "@/components/user/UserTable";
import { GetUserByOrgFromApi, GetUserByIdFromApi } from "@/api/hr/route";
import { UpdateUserStatusFromApi } from "@/api/users/route";
import type { GetUserRespond } from "@/dto/userDto";
import AddUserModal from "@/app/(protected)/organizer/users/AddUserModal";
import UserDetailsModal from "@/app/(protected)/organizer/users/UserDetailsModal";
import { useToast } from "@/components/ToastProvider";

const ORG = { id: "ORG-ADMIN", name: "ระบบผู้ดูแล" };
const INITIAL_USERS: any[] = [];

function uid(prefix = "U") {
  return `${prefix}-${Math.floor(Math.random() * 10000)}`;
}

function statusLabel(user: any) {
  if (!user?.isActive) return "ระงับการใช้งาน";
  if (user.status === "On leave") return "ลาหยุด";
  return "ใช้งาน";
}

export default function ClientManageUser() {
  const PAGE_LIMIT = 10;

  const toast = useToast();

  const [users, setUsers] = useState<any[]>(INITIAL_USERS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<any | null>(null);
  const [detailsUserData, setDetailsUserData] = useState<GetUserRespond | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [addOpen, setAddOpen] = useState(false);

  const [page, setPage] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);

  // track which user ids are currently being updated (to prevent duplicate toggles)
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const resp = await GetUserByOrgFromApi(page, PAGE_LIMIT);
        if (!mounted) return;
        const mapped = (resp.items || []).map((u: GetUserRespond) => ({
          id: u.id,
          name: u.full_name || `${u.first_name ?? ""} ${u.last_name ?? ""}`.trim(),
          title: u.position ?? "-",
          department_id: u.department_id ?? "-",
          department_name: u.department_name ?? "-",
          status: "Active",
          isActive: typeof u.is_active === "boolean" ? u.is_active : true,
          createdAt: u.last_login_at ?? undefined,
        }));
        setUsers(mapped);
        setTotalItems(resp.total ?? mapped.length);
      } catch (err: any) {
        console.error("Failed to load users:", err);
        if (mounted) setError(err?.message ?? "Failed to load users");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [page]);

  const handleAdd = (u: any) => {
    const newUser = { id: uid("EMP"), ...u, isActive: u.status !== "Inactive", createdAt: new Date().toISOString().slice(0, 10) };
    if (page === 1) setUsers((prev) => [newUser, ...prev.slice(0, PAGE_LIMIT - 1)]);
    setAddOpen(false);
  };

  const handleSaveEdit = () => {
    if (!editing) return;
    setUsers((prev) => prev.map((x) => (x.id === editing.id ? { ...editing } : x)));
    setEditing(null);
  };

  const updateIsActive = async (id?: string | number) => {
    if (id == null) return;
    const idStr = String(id);

    if (updatingIds.has(idStr)) {
      // already updating this user
      return;
    }

    const found = users.find((u) => String(u.id) === idStr);
    if (!found) return;

    const newState = !Boolean(found.isActive);
    const label = newState ? "เปิดใช้งาน" : "ระงับการใช้งาน";
    const confirmed = window.confirm(`คุณแน่ใจว่าจะ${label}ผู้ใช้นี้ใช่หรือไม่?`);
    if (!confirmed) return;

    // snapshot for rollback
    const snapshot = users;

    // optimistic update
    setUsers((prevUsers) => prevUsers.map((u) => (String(u.id) === idStr ? { ...u, isActive: newState } : u)));

    // mark as updating
    setUpdatingIds((s) => new Set(s).add(idStr));

    try {
      const payload = { user_id: idStr, is_active: newState };
      const ok = await UpdateUserStatusFromApi(payload as any);
      if (!ok) {
        // rollback
        setUsers(snapshot);
        toast.push("error", "เปลี่ยนสถานะไม่สำเร็จ", "ระบบตอบกลับข้อผิดพลาด");
      } else {
        toast.push("success", "เปลี่ยนสถานะเรียบร้อย", newState ? "ผู้ใช้ถูกเปิดใช้งานแล้ว" : "ผู้ใช้ถูกระงับแล้ว");
      }
    } catch (err: any) {
      console.error("updateIsActive error:", err);
      setUsers(snapshot);
      toast.push("error", "เกิดข้อผิดพลาด", err?.message ?? "ไม่สามารถเปลี่ยนสถานะได้");
    } finally {
      // unmark updating
      setUpdatingIds((s) => {
        const copy = new Set(s);
        copy.delete(idStr);
        return copy;
      });
    }
  };

  const fetchUserDetails = async (id?: string | number | null) => {
    if (!id) return;
    const idStr = String(id);
    setDetailsLoading(true);
    setDetailsError(null);
    setDetailsUserData(null);
    setDetailsOpen(true);
    try {
      const resp = await GetUserByIdFromApi(idStr);
      const user = resp && resp.length > 0 ? resp[0] : null;
      setDetailsUserData(user);
    } catch (err: any) {
      console.error("Failed to load user details:", err);
      setDetailsError(err?.message ?? "Failed to load details");
    } finally {
      setDetailsLoading(false);
    }
  };

  const filtered = users.filter((u) => {
    if (filter === "all") return true;
    if (filter === "active") return u.isActive === true;
    return u.isActive === false;
  });

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <div className="p-6 space-y-6 text-gray-800">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">จัดการผู้ใช้งาน</h1>
            <div className="text-sm text-gray-500">ระบบ: {ORG.name}</div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => setAddOpen(true)} className="px-3 py-2 bg-indigo-600 text-white rounded text-sm shadow-sm">เพิ่มผู้ใช้</button>
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className="border p-2 rounded text-sm">
              <option value="all">ทั้งหมด</option>
              <option value="active">ใช้งาน</option>
              <option value="inactive">ระงับการใช้งาน</option>
            </select>
          </div>
        </header>

        {loading ? (
          <div className="bg-white p-0 rounded-lg shadow-sm">
            <UsersTable
              users={[]}
              itemsPerPage={PAGE_LIMIT}
              currentPage={page}
              onPageChange={(p) => setPage(p)}
              totalItems={totalItems}
              disableNext={page * PAGE_LIMIT >= totalItems}
              onEdit={(u: any) => setEditing(u)}
              onDetails={(u: any) => fetchUserDetails(u?.id)}
              onToggleIsActive={(id) => {
                if (id == null) return;
                updateIsActive(String(id));
              }}
              showIndex={true}
              loading={true}
            />
          </div>
        ) : error ? (
          <div className="bg-white p-6 rounded-lg shadow-sm text-center text-red-600">เกิดข้อผิดพลาด: {error}</div>
        ) : (
          <UsersTable
            users={filtered}
            itemsPerPage={PAGE_LIMIT}
            currentPage={page}
            onPageChange={(p) => setPage(p)}
            totalItems={totalItems}
            disableNext={page * PAGE_LIMIT >= totalItems}
            onEdit={(u: any) => setEditing(u)}
            onDetails={(u: any) => fetchUserDetails(u?.id)}
            onToggleIsActive={(id) => {
              if (id == null) return;
              updateIsActive(String(id));
            }}
            showIndex={true}
            loading={false}
          />
        )}

        {editing && (
          <div className="fixed inset-0 flex items-end md:items-center justify-center p-4">
            <div className="w-full md:w-1/2 bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-3">แก้ไขผู้ใช้</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="border p-2 rounded text-sm" />
                <input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="border p-2 rounded text-sm" />
                <input value={editing.department_id} onChange={(e) => setEditing({ ...editing, department_id: e.target.value })} className="border p-2 rounded text-sm" />
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

        <UserDetailsModal
          open={detailsOpen}
          user={detailsUserData}
          loading={detailsLoading}
          error={detailsError}
          onClose={() => {
            setDetailsOpen(false);
            setDetailsUserData(null);
            setDetailsError(null);
          }}
        />
      </div>
    </main>
  );
}
