"use client";
import { useEffect, useRef, useState } from "react";
import { BadgeCreateFormProject } from "../Helper";
import { StrategyParams } from "@/dto/projectDto";
import { ChevronRight } from "lucide-react";

type Props = {
  value?: StrategyParams;
  onChange: (v: StrategyParams) => void;
};

export default function StrategyForm({ value, onChange }: Props) {
  // state เปิด/ปิดแต่ละ section
  const [openSchoolPlan, setOpenSchoolPlan] = useState(false);
  const [openOvEcPolicy, setOpenOvEcPolicy] = useState(false);
  const [openQaIndicator, setOpenQaIndicator] = useState(false);

  // state เก็บค่า text
  const [schoolPlan, setSchoolPlan] = useState(value?.schoolPlan ?? "");
  const [ovEcPolicy, setOvEcPolicy] = useState(value?.ovEcPolicy ?? "");
  const [qaIndicator, setQaIndicator] = useState(value?.qaIndicator ?? "");

  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // ส่งค่าออกไป โดยถ้า panel ปิดจะส่งเป็น ""
  useEffect(() => {
    onChangeRef.current({
      schoolPlan: openSchoolPlan ? schoolPlan : "",
      ovEcPolicy: openOvEcPolicy ? ovEcPolicy : "",
      qaIndicator: openQaIndicator ? qaIndicator : "",
    });
  }, [
    schoolPlan,
    ovEcPolicy,
    qaIndicator,
    openSchoolPlan,
    openOvEcPolicy,
    openQaIndicator,
  ]);

  return (
    <div className="space-y-6">
      <BadgeCreateFormProject title="ความสอดคล้องเชิงยุทธศาสตร์" />

      <div className="grid gap-4">
        <div className="border rounded-lg border-gray-200">
          <button
            type="button"
            onClick={() => setOpenSchoolPlan((prev) => !prev)}
            className="w-full flex items-center justify-between px-4 py-3 text-left"
          >
            <span className="text-xs lg:text-sm text-gray-800">
              สอดคล้องกับแผนยุทธศาสตร์ของสถานศึกษา
            </span>
            <span
              className={
                "text-gray-500 text-lg leading-none transform transition-transform duration-200 " +
                (openSchoolPlan ? "rotate-90" : "")
              }
            >
              <ChevronRight className="h-6 w-6 text-gray-600"/>
            </span>
          </button>

          <div
            className={
              "px-4 transition-all duration-300 ease-in-out overflow-hidden " +
              (openSchoolPlan ? "max-h-40 opacity-100 pb-4" : "max-h-0 opacity-0 pb-0")
            }
          >
            <textarea
              value={schoolPlan}
              onChange={(e) => setSchoolPlan(e.target.value)}
              rows={3}
              className="px-4 py-2 border rounded-lg border-gray-300 w-full"
              placeholder="กรอกข้อมูล..."
            />
          </div>
        </div>

        <div className="border rounded-lg border-gray-200">
          <button
            type="button"
            onClick={() => setOpenOvEcPolicy((prev) => !prev)}
            className="w-full flex items-center justify-between px-4 py-3 text-left"
          >
            <span className="text-xs lg:text-sm text-gray-800">
              สอดคล้องกับนโยบาย / ยุทธศาสตร์ของสำนักงาน
              <br className="lg:hidden block" />
              คณะกรรมการการอาชีวศึกษา (สอศ.)
            </span>
            <span
              className={
                "text-gray-500 text-lg leading-none transform transition-transform duration-200 " +
                (openOvEcPolicy ? "rotate-90" : "")
              }
            >
              <ChevronRight className="h-6 w-6 text-gray-600"/>
            </span>
          </button>

          <div
            className={
              "px-4 transition-all duration-300 ease-in-out overflow-hidden " +
              (openOvEcPolicy ? "max-h-40 opacity-100 pb-4" : "max-h-0 opacity-0 pb-0")
            }
          >
            <textarea
              value={ovEcPolicy}
              onChange={(e) => setOvEcPolicy(e.target.value)}
              rows={3}
              className="px-4 py-2 border rounded-lg border-gray-300 w-full"
              placeholder="กรอกข้อมูล..."
            />
          </div>
        </div>

        <div className="border rounded-lg border-gray-200">
          <button
            type="button"
            onClick={() => setOpenQaIndicator((prev) => !prev)}
            className="w-full flex items-center justify-between px-4 py-3 text-left"
          >
            <span className="text-xs lg:text-sm text-gray-800">
              สอดคล้องกับตัวชี้วัดงานประกันคุณภาพภายใน
              <br className="lg:hidden block" /> (ระบุมาตรฐานและตัวบ่งชี้)
            </span>
            <span
              className={
                "text-gray-500 text-lg leading-none transform transition-transform duration-200 " +
                (openQaIndicator ? "rotate-90" : "")
              }
            >
              <ChevronRight className="h-6 w-6 text-gray-600"/>
            </span>
          </button>

          <div
            className={
              "px-4 transition-all duration-300 ease-in-out overflow-hidden " +
              (openQaIndicator ? "max-h-40 opacity-100 pb-4" : "max-h-0 opacity-0 pb-0")
            }
          >
            <textarea
              value={qaIndicator}
              onChange={(e) => setQaIndicator(e.target.value)}
              rows={3}
              className="px-4 py-2  border rounded-lg border-gray-300 w-full"
              placeholder="กรอกข้อมูล..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
