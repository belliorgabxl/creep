"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, X } from "lucide-react";

export default function CreateDepartmentPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    code: "",
    name: "",
    head: "",
    employees: "",
    projectsCount: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await new Promise((r) => setTimeout(r, 1500));

      console.log("New Department:", form);
      alert("สร้างหน่วยงานสำเร็จ");
      router.push("/user/department");
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            สร้างหน่วยงานใหม่
          </h1>
          <p className="text-sm text-gray-600">
            เพิ่มข้อมูลหน่วยงานใหม่เข้าสู่ระบบ เช่น ฝ่ายวิชาการ
            ฝ่ายกิจการนักเรียน
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-5"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            รหัสหน่วยงาน <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="code"
            value={form.code}
            onChange={handleChange}
            placeholder="เช่น ADM, HR, FIN"
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ชื่อหน่วยงาน <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="เช่น ฝ่ายบริหาร / ฝ่ายวิชาการ"
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            หัวหน้าหน่วยงาน
          </label>
          <input
            type="text"
            name="head"
            value={form.head}
            onChange={handleChange}
            placeholder="ชื่อหัวหน้าหน่วยงาน"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              จำนวนพนักงาน
            </label>
            <input
              type="number"
              name="employees"
              value={form.employees}
              onChange={handleChange}
              placeholder="เช่น 10"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              จำนวนโครงการที่เกี่ยวข้อง
            </label>
            <input
              type="number"
              name="projectsCount"
              value={form.projectsCount}
              onChange={handleChange}
              placeholder="เช่น 3"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <X className="h-4 w-4" /> ยกเลิก
          </button>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-1 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {loading ? "กำลังบันทึก..." : "บันทึกหน่วยงาน"}
          </button>
        </div>
      </form>
    </main>
  );
}
