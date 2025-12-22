import React from "react";

export default function FailedScreenPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-rose-50 via-white to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="rounded-3xl bg-white border border-rose-100 shadow-[0_20px_60px_rgba(0,0,0,0.08)] overflow-hidden">
          {/* Top accent */}
          <div className="h-2 w-full bg-gradient-to-r from-rose-500 via-red-500 to-orange-400" />

          <div className="p-6 sm:p-8">
            {/* Icon */}
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 border border-rose-100">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M12 9v4"
                  stroke="currentColor"
                  className="text-rose-600"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M12 17h.01"
                  stroke="currentColor"
                  className="text-rose-600"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
                  stroke="currentColor"
                  className="text-rose-600"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Text */}
            <h1 className="mt-5 text-center text-xl sm:text-2xl font-semibold text-slate-900">
              ทำรายการไม่สำเร็จ
            </h1>
            <p className="mt-2 text-center text-sm text-slate-600 leading-6">
              ขออภัย ระบบไม่สามารถดำเนินการตามคำขอของคุณได้ในขณะนี้
              <br />
              กรุณาลองใหม่อีกครั้งภายหลัง
            </p>

            {/* Error box (static UI) */}
            <div className="mt-5 rounded-2xl border border-rose-100 bg-rose-50/60 p-4">
              <p className="text-xs font-medium text-rose-700">
                รหัสข้อผิดพลาด
              </p>
              <p className="mt-1 font-mono text-sm text-slate-900">
                FAILED_001
              </p>
            </div>

            {/* Buttons (UI only) */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                className="rounded-2xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white hover:bg-rose-700 transition"
              >
                ลองใหม่
              </button>

              <button
                type="button"
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50 transition"
              >
                กลับหน้าหลัก
              </button>
            </div>

            {/* Hint */}
            <div className="mt-4 text-center text-xs text-slate-400">
              หากปัญหายังคงอยู่ กรุณาติดต่อฝ่ายดูแลระบบ
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
