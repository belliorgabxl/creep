"use client"

import { useState } from "react"
import { Save, LogOut, Upload } from "lucide-react"
import Image from "next/image"

export default function AccountSettingsPage() {
  const [form, setForm] = useState({
    name: "ภัทรจาริน นภากาญจน์",
    email: "patarajarin.n@tcc-technology.com",
    phone: "0812345678",
    position: "Backend Developer",
  })
  const [avatar, setAvatar] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setAvatar(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1500)) 
    setLoading(false)
    alert("อัปเดตข้อมูลสำเร็จ ✅")
  }

  const handleLogout = () => {
    document.cookie = "mock_uid=; Path=/; Max-Age=0;"
    document.cookie = "mock_role=; Path=/; Max-Age=0;"
    window.location.href = "/login"
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">ตั้งค่าบัญชีผู้ใช้</h1>
        <p className="text-sm text-gray-600">จัดการข้อมูลส่วนตัวและการเข้าสู่ระบบของคุณ</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-gray-200 bg-white p-6 shadow-xl space-y-6"
      >
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="relative h-24 w-24">
            <Image
              src={avatar || "/user.jpg"}
              alt="avatar"
              fill
              className="rounded-full object-cover border border-gray-200"
            />
          </div>
          <label
            htmlFor="avatar"
            className="flex items-center gap-2 text-sm text-indigo-600 hover:underline cursor-pointer"
          >
            <Upload className="h-4 w-4" /> เปลี่ยนรูปโปรไฟล์
          </label>
          <input id="avatar" type="file" accept="image/*" className="hidden" onChange={handleUpload} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อ - นามสกุล</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="input px-4 py-1 border border-gray-300 rounded-md"
              placeholder="ชื่อของคุณ"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ตำแหน่ง</label>
            <input
              type="text"
              name="position"
              value={form.position}
              onChange={handleChange}
              className="input px-4 py-1 border border-gray-300 rounded-md"
              placeholder="เช่น อาจารย์ / เจ้าหน้าที่ / Developer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">อีเมล</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="input px-4 py-1 border border-gray-300 rounded-md"
              placeholder="example@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">เบอร์โทรศัพท์</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="input px-4 py-1 border border-gray-300 rounded-md"
              placeholder="08XXXXXXXX"
            />
          </div>
        </div>


        <div className="pt-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">รหัสผ่านใหม่</label>
          <input
            type="password"
            name="password"
            className="input px-4 py-1 border border-gray-300 rounded-md"
            placeholder="••••••••"
          />
          <p className="text-xs text-gray-500 mt-1">หากไม่ต้องการเปลี่ยนรหัสผ่าน ให้เว้นว่างไว้</p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <LogOut className="h-4 w-4" /> ออกจากระบบ
          </button>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-1 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {loading ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
          </button>
        </div>
      </form>
    </main>
  )
}

const inputClass = `
  w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
  focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
`
