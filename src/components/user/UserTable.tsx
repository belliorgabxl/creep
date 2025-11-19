"use client"

import React, { useMemo, useState } from "react"
import { Eye, Edit } from "lucide-react"

type User = {
    id: string
    name: string
    title?: string
    department?: string
    status?: string
    isActive?: boolean
    createdAt?: string
}

type Org = {
    id: string
    name?: string
    quota?: number
}

interface UsersTableProps {
    users?: User[]
    org?: Org
    onToggleIsActive?: (id: string) => void
    onEdit?: (u: User) => void
    onDetails?: (u: User) => void
}

export function UsersTable({ users = [], org, onToggleIsActive, onEdit, onDetails }: UsersTableProps) {
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    const rows = useMemo(() => {
        return users.map((u) => ({
            ...u,
            statusLabel: u.isActive ? (u.status === "On leave" ? "ลาหยุด" : "ใช้งาน") : "ระงับการใช้งาน",
        }))
    }, [users])

    const totalPages = Math.max(1, Math.ceil(rows.length / itemsPerPage))
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentRows = rows.slice(startIndex, endIndex)

    const formatDate = (iso?: string | null) => {
        if (!iso) return "-"
        const d = new Date(iso)
        if (Number.isNaN(d.getTime())) return iso
        return d.toLocaleDateString("th-TH", { day: "2-digit", month: "short", year: "numeric" })
    }

    // Called when the row itself is activated (click or keyboard)
    const handleRowActivate = (e: React.MouseEvent | React.KeyboardEvent, u: User) => {
        // if event originates from a button inside the row, do nothing (buttons/inputs stopPropagation themselves)
        onDetails?.(u)
    }

    return (
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
                <div>
                    <h3 className="text-sm font-semibold text-gray-900">รายการผู้ใช้งาน</h3>
                    <p className="mt-1 text-xs text-gray-500">จัดการสถานะและรายละเอียดผู้ใช้งาน</p>
                </div>

                <div className="flex items-center gap-2">
                    <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                        {rows.length} ผู้ใช้
                    </span>
                    {org && (
                        <span className="rounded-md bg-gray-50 px-2.5 py-1 text-xs text-gray-600">
                            สรุป: <span className="font-medium">{rows.length}</span> / <span className="font-medium">{org.quota ?? '-'}</span>
                        </span>
                    )}
                </div>
            </div>

            <div className="p-4">
                <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                    <table className="w-full border-collapse text-xs">
                        <thead>
                            <tr className="bg-gray-50 text-center text-gray-900">
                                {[
                                    "ชื่อ",
                                    "ตำแหน่ง",
                                    "แผนก",
                                    "สถานะใช้งาน",
                                    "วันที่สร้าง",
                                    "จัดการ",
                                ].map((h, i) => (
                                    <th key={i} className={`px-3 py-2 font-semibold ${h === 'สถานะใช้งาน' ? 'text-center' : ''}`}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {currentRows.length > 0 ? (
                                currentRows.map((u) => (
                                    <tr
                                        key={u.id}
                                        className="border-t border-gray-200 hover:bg-gray-50"
                                        // make row focusable & keyboard-activatable
                                        tabIndex={0}
                                        role="button"
                                        onClick={(e) => handleRowActivate(e, u)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" || e.key === " ") {
                                                e.preventDefault()
                                                handleRowActivate(e, u)
                                            }
                                        }}
                                    >
                                        <td className="px-3 py-2 font-medium text-gray-900 text-left">{u.name}</td>
                                        <td className="px-3 py-2 text-gray-700">{u.title ?? '-'}</td>
                                        <td className="px-3 py-2">
                                            <span className="inline-flex items-center rounded-md border border-gray-200 px-2 py-0.5 text-[11px] font-medium text-gray-700">
                                                {u.department ?? '-'}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2 text-center">
                                            {/* Toggle switch for active/inactive */}
                                            <button
                                                onClick={(e) => { e.stopPropagation(); onToggleIsActive?.(u.id) }}
                                                aria-pressed={u.isActive}
                                                title={u.isActive ? 'ระงับการใช้งาน' : 'เปิดใช้งาน'}
                                                className={`relative inline-flex items-center h-6 w-12 rounded-full transition-colors focus:outline-none ${u.isActive ? 'bg-green-600' : 'bg-gray-300'}`}
                                            >
                                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${u.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                                                <span className="sr-only">{u.statusLabel}</span>
                                            </button>
                                        </td>
                                        <td className="px-3 py-2 text-center text-gray-700">{formatDate(u.createdAt)}</td>

                                        <td className="px-3 py-2">
                                            <div className="flex items-center justify-center gap-1">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); onDetails?.(u) }}
                                                    className="h-8 w-8 rounded-md hover:bg-blue-600/10 hover:text-blue-700"
                                                    title="รายละเอียด"
                                                >
                                                    <Eye className="mx-auto h-4 w-4" />
                                                </button>

                                                <button
                                                    onClick={(e) => { e.stopPropagation(); onDetails?.(u) }}
                                                    className="h-8 w-8 rounded-md hover:bg-blue-600/10 hover:text-blue-700"
                                                    title="รายละเอียด"
                                                >
                                                    <Edit className="mx-auto h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-3 py-10 text-center text-sm text-gray-500">
                                        <div className="space-y-2">
                                            <p className="text-base font-medium text-gray-700">ยังไม่มีผู้ใช้ในระบบ</p>
                                            <p className="text-xs text-gray-500">คุณสามารถเพิ่มผู้ใช้ใหม่หรือกรองรายการเพื่อค้นหา</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination / Footer */}
                <div className="mt-6 flex items-center justify-between">
                    <p className="text-xs font-medium text-gray-600">
                        แสดง {rows.length === 0 ? 0 : startIndex + 1}-{Math.min(endIndex, rows.length)} จาก {rows.length} รายการ
                    </p>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1 || rows.length === 0}
                            className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-xs shadow-sm hover:bg-gray-50 disabled:opacity-50"
                        >
                            ก่อนหน้า
                        </button>

                        <span className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700">
                            หน้า {currentPage} / {totalPages}
                        </span>

                        <button
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages || rows.length === 0}
                            className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-xs shadow-sm hover:bg-gray-50 disabled:opacity-50"
                        >
                            ถัดไป
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UsersTable
