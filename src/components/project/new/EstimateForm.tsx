"use client";
import { useState, useEffect } from "react";
import { BadgeCreateFormProject } from "../Helper";
import { EstimateParams } from "@/dto/projectDto";

type Props = {
  value?: EstimateParams;
  onChange: (params: EstimateParams) => void;
};

export default function EstimateForm({ value, onChange }: Props) {
  const [method, setMethod] = useState(value?.method ?? "");
  const [evaluator, setEvaluator] = useState(value?.evaluator ?? "");
  const [period, setPeriod] = useState(value?.period ?? "");

  useEffect(() => {
    onChange({ method, evaluator, period });
  }, [method, evaluator, period, onChange]);

  return (
    <div className="space-y-4">
      <BadgeCreateFormProject title="การติดตามและประเมินผล" />

      <div className="grid lg:flex flex-wrap gap-4 pb-4">
        <span className="font-medium">วิธีการประเมินผล</span>
        <div className="grid gap-4 lg:flex">
          {["แบบสอบถาม", "สัมภาษณ์", "สังเกตพฤติกรรม", "รายงานผล"].map((m) => (
            <label key={m} className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={method === m}
                onChange={() => setMethod(m)}
                className="h-4 w-4"
              />
              <span>{m}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="lg:flex grid gap-4 pb-4">
        <label className="font-medium">ผู้รับผิดชอบการประเมินผล</label>
        <input
          type="text"
          value={evaluator}
          onChange={(e) => setEvaluator(e.target.value)}
          placeholder="ระบุชื่อผู้รับผิดชอบ"
          className="ml-2 w-80 border-b border-gray-400 focus:outline-none"
        />
      </div>

      <div className="lg:flex grid gap-4">
        <label className="font-medium">ระยะเวลาการประเมินผล</label>
        <input
          type="text"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          placeholder="เช่น พ.ย. 68 - ก.พ. 69"
          className="ml-2 w-80 border-b border-gray-400 focus:outline-none"
        />
      </div>
    </div>
  );
}
