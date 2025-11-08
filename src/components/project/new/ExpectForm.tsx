"use client";
import * as React from "react";
import { BadgeCreateFormProject } from "../Helper";
import { ExpectParams } from "@/dto/projectDto";

type Props = {
  value: ExpectParams;
  onChange: (v: ExpectParams) => void;
};

export default function ExpectForm({ value, onChange }: Props) {
  const update = (patch: Partial<ExpectParams>) =>
    onChange({ ...value, ...patch });

  return (
    <div className="space-y-4">
      <BadgeCreateFormProject title="ผลที่คาดว่าจะได้รับ" />

      <h2 className="font-medium text-gray-800">ผลที่คาดว่าจะได้รับ</h2>
      <textarea
        value={value.result}
        onChange={(e) => update({ result: e.target.value })}
        className="min-h-[120px] w-full py-2 px-4 rounded-lg border border-gray-300"
        placeholder="ระบุผลที่คาดว่าจะได้รับ เช่น ผู้เรียนมีทักษะเพิ่มขึ้น หรือสถานศึกษามีภาพลักษณ์ที่ดีขึ้น"
      />
    </div>
  );
}
