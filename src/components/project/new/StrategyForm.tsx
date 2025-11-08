"use client";
import { useEffect, useRef, useState } from "react";
import { BadgeCreateFormProject } from "../Helper";
import { StrategyParams } from "@/dto/projectDto";

type Props = {
  value?: StrategyParams;
  onChange: (v: StrategyParams) => void;
};

export default function StrategyForm({ value, onChange }: Props) {
  const [schoolPlan, setSchoolPlan] = useState(value?.schoolPlan ?? "");
  const [ovEcPolicy, setOvEcPolicy] = useState(value?.ovEcPolicy ?? "");
  const [qaIndicator, setQaIndicator] = useState(value?.qaIndicator ?? "");

  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    onChangeRef.current({ schoolPlan, ovEcPolicy, qaIndicator });
  }, [schoolPlan, ovEcPolicy, qaIndicator]);

  return (
    <div className="space-y-4">
      <BadgeCreateFormProject title="ความสอดคล้องเชิงยุทธศาสตร์" />

      <div className="grid gap-4">
        <div className=" grid gap-3 items-center">
          <label className="text-sm text-gray-700">
            สอดคล้องกับแผนยุทธศาสตร์ของสถานศึกษา
          </label>
          <textarea
            value={schoolPlan}
            onChange={(e) => setSchoolPlan(e.target.value)}
            rows={3}
            className="px-4 py-2 border rounded-lg border-gray-300 w-full"
            placeholder="กรอกข้อมูล..."
          />
        </div>

        <div className=" grid gap-3 items-center">
          <label className="text-sm text-gray-700">
            สอดคล้องกับนโยบาย / ยุทธศาสตร์ของสำนักงาน
            <br className="lg:hidden block" />
            คณะกรรมการการอาชีวศึกษา (สอศ.)
          </label>
          <textarea
            value={ovEcPolicy}
            onChange={(e) => setOvEcPolicy(e.target.value)}
            rows={3}
            className="px-4 py-2 border rounded-lg border-gray-300 w-full"
            placeholder="กรอกข้อมูล..."
          />
        </div>

        <div className=" grid gap-3 items-center">
          <label className="text-sm text-gray-700">
            สอดคล้องกับตัวชี้วัดงานประกันคุณภาพภายใน
            <br className="lg:hidden block" />
            (ระบุมาตรฐานและตัวบ่งชี้)
          </label>
          <textarea
            value={qaIndicator}
            onChange={(e) => setQaIndicator(e.target.value)}
            rows={3}
            className="px-4 py-2 border rounded-lg border-gray-300 w-full"
            placeholder="กรอกข้อมูล..."
          />
        </div>
      </div>
    </div>
  );
}
