import Link from "next/link";

export function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center">
      <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-white shadow grid place-items-center">
        📁
      </div>
      <h3 className="text-base font-semibold text-gray-900">ยังไม่มีโปรเจ็กต์ของคุณ</h3>
      <p className="mt-1 text-sm text-gray-600">
        เริ่มต้นสร้างโปรเจ็กต์ใหม่เพื่อวางแผนงานและติดตามความคืบหน้า
      </p>
      <div className="mt-6 flex items-center justify-center gap-3">
        <Link
          href="/user/projects/new"
          className="inline-flex items-center rounded-lg bg-gradient-to-r hover:scale-[102%] from-indigo-500 to-purple-500 px-4 py-2 text-sm font-medium text-white hover:bg-black"
        >
          สร้างโปรเจ็กต์ใหม่
        </Link>
        <Link
          href="#"
          className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
        >
          ดูทั้งหมด
        </Link>
      </div>
    </div>
  )
}
