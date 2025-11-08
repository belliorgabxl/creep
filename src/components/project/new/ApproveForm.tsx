"use client";
import * as React from "react";
import { BadgeCreateFormProject } from "../Helper";
import { ApproveParams } from "@/dto/projectDto";

type Props = {
  value: ApproveParams;
  onChange: (v: ApproveParams) => void;
};

export default function ApproveForm({ value, onChange }: Props) {
  const update = (patch: Partial<ApproveParams>) =>
    onChange({ ...value, ...patch });

  return (
    <div className="space-y-4">
      <BadgeCreateFormProject title="การอนุมัติและลงนาม" />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex gap-3 items-center">
          <label
            htmlFor="proposerName"
            className="text-sm text-gray-700 min-w-[9rem]"
          >
            ผู้เสนอ
          </label>
          <input
            id="proposerName"
            value={value.proposerName}
            onChange={(e) => update({ proposerName: e.target.value })}
            className="px-4 py-1 border rounded-lg border-gray-300 w-full"
            placeholder="ระบุชื่อ-สกุล"
          />
        </div>

        <div className="flex gap-3 items-center">
          <label
            htmlFor="proposerPosition"
            className="text-sm text-gray-700 min-w-[6rem]"
          >
            ตำแหน่ง
          </label>
          <input
            id="proposerPosition"
            value={value.proposerPosition}
            onChange={(e) => update({ proposerPosition: e.target.value })}
            className="px-4 py-1 border rounded-lg border-gray-300 w-full"
            placeholder="เช่น หัวหน้างาน/ครูที่ปรึกษา"
          />
        </div>

        <div className="flex gap-3 items-center md:col-span-2">
          <label
            htmlFor="proposeDate"
            className="text-sm text-gray-700 min-w-[9rem]"
          >
            วันที่เสนอ
          </label>
          <input
            id="proposeDate"
            type="date"
            value={value.proposeDate || ""}
            onChange={(e) => update({ proposeDate: e.target.value })}
            className="px-4 py-1 border rounded-lg border-gray-300"
            placeholder="YYYY-MM-DD"
          />
        </div>
      </div>
      <div className="grid gap-4">
        <div className="flex items-start gap-3">
          <label
            htmlFor="deptComment"
            className="text-sm text-gray-700 min-w-[18rem]"
          >
            ความคิดเห็นของหัวหน้างาน/แผนก
          </label>
          <textarea
            id="deptComment"
            rows={3}
            value={value.deptComment}
            onChange={(e) => update({ deptComment: e.target.value })}
            className="px-4 py-2 border rounded-lg border-gray-300 w-full"
            placeholder="กรอกความคิดเห็น..."
          />
        </div>

        <div className="flex items-start gap-3">
          <label
            htmlFor="directorComment"
            className="text-sm text-gray-700 min-w-[18rem]"
          >
            ความคิดเห็นของผู้บริหาร / ผู้อำนวยการสถานศึกษา
          </label>
          <textarea
            id="directorComment"
            rows={3}
            value={value.directorComment}
            onChange={(e) => update({ directorComment: e.target.value })}
            className="px-4 py-2 border rounded-lg border-gray-300 w-full"
            placeholder="กรอกความคิดเห็น..."
          />
        </div>
      </div>
    </div>
  );
}
