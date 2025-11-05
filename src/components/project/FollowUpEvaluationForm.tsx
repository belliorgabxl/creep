"use client";
import { useState } from "react";

export default function FollowUpEvaluationForm() {
  const [methods, setMethods] = useState<string[]>([]);
  const [evaluator, setEvaluator] = useState("");
  const [period, setPeriod] = useState("");

  const toggleMethod = (method: string) => {
    setMethods((prev) =>
      prev.includes(method)
        ? prev.filter((m) => m !== method)
        : [...prev, method]
    );
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-blue-700">
        การติดตามและประเมินผล
      </h2>
      <div className="grid lg:flex flex-wrap gap-4 pb-4">
        <span className="font-medium">วิธีการประเมินผล</span>
        <div className="grid gap-4 lg:flex">
          {["แบบสอบถาม", "สัมภาษณ์", "สังเกตพฤติกรรม", "รายงานผล"].map(
            (method) => (
              <label key={method} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={methods.includes(method)}
                  onChange={() => toggleMethod(method)}
                  className="h-4 w-4"
                />
                <span>{method}</span>
              </label>
            )
          )}
        </div>
      </div>
      <div className="lg:flex grid gap-4 pb-4">
        <label className="font-medium">ผู้รับผิดชอบการประเมินผล</label>{" "}
        <input
          type="text"
          value={evaluator}
          onChange={(e) => setEvaluator(e.target.value)}
          placeholder="ระบุชื่อผู้รับผิดชอบ"
          className="ml-2 w-80 border-b border-gray-400 focus:outline-none"
        />
      </div>
      <div className="lg:flex grid gap-4">
        <label className="font-medium">ระยะเวลาการประเมินผล</label>{" "}
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
