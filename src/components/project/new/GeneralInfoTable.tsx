"use client";
import { useState, useEffect } from "react";
import { BadgeCreateFormProject } from "../Helper";
import { GeneralInfoParams } from "@/dto/projectDto";

type Props = {
  value?: GeneralInfoParams;
  onChange: (params: GeneralInfoParams) => void;
};

export default function GeneralInfoTable({ value, onChange }: Props) {
  const [name, setName] = useState(value?.name ?? "");
  const [type, setType] = useState(value?.type ?? "");
  const [department, setDepartment] = useState(value?.department ?? "");
  const [owner, setOwner] = useState(value?.owner ?? "");

  useEffect(() => {
    onChange({ name, type, department, owner });
  }, [name, type, department, owner, onChange]);

  return (
    <div className="space-y-4">
      <BadgeCreateFormProject title="ข้อมูลพื้นฐาน" />

      <div className="grid gap-4">
        <div className="lg:flex grid gap-3 items-center">
          <label className="text-sm text-gray-700 min-w-[180px]">
            ชื่อแผนการ / โครงการ
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-4 py-1 border rounded-lg border-gray-300 w-full"
            placeholder="ระบุชื่อโครงการ"
          />
        </div>
        <div className="lg:flex grid gap-3 items-center">
          <label className="text-sm text-gray-700 min-w-[180px]">ประเภทโครงการ</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="px-4 py-1 border rounded-lg border-gray-300 w-full"
          >
            <option value="">เลือกประเภท</option>
            <option value="แผนงานประจำ">แผนงานประจำ</option>
            <option value="โครงการพิเศษ / พัฒนา">โครงการพิเศษ / พัฒนา</option>
          </select>
        </div>
        <div className="lg:flex grid gap-3 items-center">
          <label className="text-sm text-gray-700 min-w-[180px]">
            หน่วยงาน / แผนกที่รับผิดชอบ
          </label>
          <input
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="px-4 py-1 border rounded-lg border-gray-300 w-full"
            placeholder="เช่น แผนกบริหารธุรกิจ"
          />
        </div>

        <div className="lg:flex grid gap-3 items-center">
          <label className="text-sm text-gray-700 min-w-[180px]">ผู้รับผิดชอบโครงการ</label>
          <input
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            className="px-4 py-1 border rounded-lg border-gray-300 w-full"
            placeholder="เช่น นายสมชาย ใจดี"
          />
        </div>
      </div>
    </div>
  );
}
