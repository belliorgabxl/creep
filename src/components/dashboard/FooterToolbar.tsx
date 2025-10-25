"use client"

import { Plus, Download, Share2, HelpCircle } from "lucide-react"

export function FooterToolbar() {
  return (
    <div className="sticky bottom-0 z-40 border-t border-gray-200 bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Primary action */}
          <button className="inline-flex items-center gap-2 rounded-md bg-gray-700 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-800">
            <Plus className="h-4 w-4" />
            สร้างโครงการใหม่
          </button>

          {/* Secondary actions */}
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-transparent px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">ส่งออก</span>
            </button>

            <button className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-transparent px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">แชร์รายงาน</span>
            </button>

            <button className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-transparent px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
              <HelpCircle className="h-4 w-4" />
              <span className="hidden sm:inline">ช่วยเหลือ</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
