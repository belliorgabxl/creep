// src/app/(protected)/organizer/department/page.tsx (server)
import Link from "next/link";
import { Plus } from "lucide-react";
import ClientDepartmentList from "./ClientDepartmentList";

export default function DepartmentPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">หน่วยงาน</h1>
          <p className="text-sm text-gray-600">
            รายการหน่วยงาน
          </p>
        </div>

        <Link
          href="/organizer/department/new"
          className="inline-flex items-center gap-4 rounded-lg bg-gradient-to-r from-indigo-500 to-blue-700 px-3.5 py-2 text-sm font-medium text-white"
        >
          <div className="border border-white rounded-full p-1">
            <Plus className="text-white h-4 w-4" />
          </div>
          สร้างหน่วยงาน
        </Link>
      </div>

      <ClientDepartmentList />
    </main>
  );
}
