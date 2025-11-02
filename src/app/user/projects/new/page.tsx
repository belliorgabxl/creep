"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Save, Send } from "lucide-react";
import { ActivityBudgetTable } from "@/components/project/ActivityTable";
import KPIActivitiesTable from "@/components/project/KPITable";
import FollowUpEvaluationForm from "@/components/project/FollowUpEvaluationForm";

const steps = [
  "ข้อมูลพื้นฐาน",
  "ความสอดคล้องเชิงยุทธศาสตร์",
  "หลักการและเหตุผล",
  "วัตถุประสงค์ของโครงการ",
  "เป้าหมายของโครงการ",
  "ระยะเวลาดำเนินงาน",
  "สถานที่ดำเนินงาน",
  "งบประมาณ",
  "ตัวชี้วัดความสำเร็จ (KPI)",
  "การติดตามและประเมินผล",
  "ผลที่คาดว่าจะได้รับ",
  "ข้อเสนอแนะ",
  "การอนุมัติและลงนาม",
];

export default function CreateProjectPage() {
  const [step, setStep] = useState(0);
  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const [rowsKPI, setRowKPI] = useState([
    { id: 1, activity: "", period: "", owner: "" },
  ]);

  return (
    <main className="lg:mx-auto lg:max-w-7xl w-full px-2 lg:px-6 py-0">
      <h1 className="text-2xl font-semibold text-gray-900 mb-1">
        สร้างโปรเจ็คใหม่
      </h1>
      <p className="text-sm text-gray-600 mb-6">
        กรอกข้อมูลทั้งหมดเพื่อสร้างโปรเจ็ค
      </p>
      <div className="flex items-start gap-2 mb-6">
        {steps.map((label, index) => (
          <div key={index} className="flex-1">
            <div
              className={`h-2 rounded-full ${
                index <= step ? "bg-indigo-600" : "bg-gray-200"
              }`}
            />
            <p
              className={`text-[10px] lg:block hidden mt-1 text-center ${
                index === step ? "text-indigo-700 font-medium" : "text-gray-500"
              }`}
            >
              {label}
            </p>
          </div>
        ))}
      </div>

      <div className="relative min-h-[320px]">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <h2 className="font-medium text-gray-800">ข้อมูลพื้นฐาน</h2>
              <div className="grid lg:grid-cols-2 gap-4">
                <div className="lg:flex grid  gap-3 items-center">
                  <label className="text-sm text-gray-700">
                    ชื่อแผนการ / โครงการ
                  </label>
                  <input
                    className="px-4 py-1 border rounded-lg border-gray-300"
                    placeholder="Project name"
                  />
                </div>
                <div className="lg:flex grid  gap-3 items-center">
                  <label className="text-sm text-gray-700">ประเภทโครงการ</label>
                  <select className="px-4 py-1 border rounded-lg border-gray-300">
                    <option>เลือกประเภท</option>
                    <option>แผนงานประจำ</option>
                    <option>โครงการพิเศษ / พัฒนา</option>
                  </select>
                </div>
                <div className="lg:flex grid  gap-3 items-center">
                  <label className="text-sm text-gray-700">
                    หน่วยงาน / แผนกที่รับผิดชอบ
                  </label>
                  <input
                    className="px-4 py-1 border rounded-lg border-gray-300"
                    placeholder="Department"
                  />
                </div>
                <div className="lg:flex grid gap-3 items-center">
                  <label className="text-sm text-gray-700">
                    ผู้รับผิดชอบโครงการ
                  </label>
                  <input
                    className="px-4 py-1 border rounded-lg border-gray-300"
                    placeholder="Department"
                  />
                </div>
              </div>
            </motion.div>
          )}
          {step === 1 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              className="space-y-4"
            >
              <h2 className="font-medium text-gray-800">
                ความสอดคล้องเชิงยุทธศาสตร์
              </h2>
              <div className="grid gap-4">
                <div className="lg:flex grid   gap-3 items-center">
                  <label className="text-sm text-gray-700">
                    สอดคล้องกับแผนยุทธศาสตร์ของสถานศึกษา
                  </label>
                  <input
                    className="px-4  py-1 border rounded-lg border-gray-300"
                    placeholder="กรอกข้อมูล..."
                  />
                </div>
                <div className="lg:flex grid  gap-3 items-center">
                  <label className="text-sm text-gray-700">
                    สอดคล้องกับนโยบาย / ยุทธศาสตร์ของสำนักงาน
                    <br className="lg:hidden block" />
                    คณะกรรมการการอาชีวศึกษา (สอศ.)
                  </label>
                  <input
                    className="px-4 py-1 border rounded-lg border-gray-300"
                    placeholder="กรอกข้อมูล..."
                  />
                </div>
                <div className="lg:flex grid gap-3 items-center">
                  <label className="text-sm text-gray-700">
                    สอดคล้องกับตัวชี้วัดงานประกันคุณภาพภายใน
                    <br className="lg:hidden block" />
                    (ระบุมาตรฐานและตัวบ่งชี้)
                  </label>
                  <input
                    className="px-4  py-1 border rounded-lg border-gray-300"
                    placeholder="กรอกข้อมูล..."
                  />
                </div>
              </div>
            </motion.div>
          )}
          {step === 2 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              className="space-y-4"
            >
              <h2 className="font-medium text-gray-800">หลักการและเหตุผล</h2>
              <textarea
                className="input min-h-[120px] w-full py-1 px-4 rounded-lg border border-gray-300"
                placeholder="ระบุหลักการและเหตุผล..."
              />
            </motion.div>
          )}
          {step === 3 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              className="space-y-4"
            >
              <h2 className="font-medium text-gray-800">
                วัตถุประสงค์ของโครงการ
              </h2>
              <textarea
                className="input min-h-[120px] w-full py-1 px-4 rounded-lg border border-gray-300"
                placeholder="ระบุวัตถุประสงค์ของโครงการ..."
              />
            </motion.div>
          )}
          {step === 4 && (
            <motion.div
              key="step-5"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              className="space-y-4"
            >
              <h2 className="font-medium text-gray-800">เป้าหมายเชิงปริมาณ</h2>
              <textarea
                className="input min-h-[120px] w-full py-1 px-4 rounded-lg border border-gray-300"
                placeholder="เป้าหมายเชิงปริมาณ..."
              />
              <h2 className="font-medium text-gray-800">เป้าหมายเชิงคุณภาพ</h2>
              <textarea
                className="input min-h-[120px] w-full py-1 px-4 rounded-lg border border-gray-300"
                placeholder="เป้าหมายเชิงคุณภาพ..."
              />
            </motion.div>
          )}
          {step === 5 && (
            <motion.div
              key="step-6"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              className="space-y-4"
            >
              <div className=" grid lg:flex gap-5 items-center justify-start">
                <div className="grid lg:flex gap-3 items-center">
                  <label className="text-sm text-gray-700">วันเริ่มต้น</label>
                  <input
                    type="date"
                    className="px-4 py-1 border rounded-lg border-gray-300"
                    placeholder="3"
                  />
                </div>
                <div className="grid lg:flex gap-3 items-center">
                  <label className="text-sm text-gray-700">วันที่สิ้นสุด</label>
                  <input
                    type="date"
                    className="px-4 py-1  border rounded-lg border-gray-300"
                    placeholder="3"
                  />
                </div>
              </div>

              <div className="grid lg:flex gap-3 items-center">
                <label className="text-sm text-gray-700">
                  ระยะเวลา (เดือน)
                </label>
                <input
                  type="number"
                  className="px-4 py-1 border rounded-lg border-gray-300"
                  placeholder="3"
                />
              </div>
            </motion.div>
          )}
          {step === 6 && (
            <motion.div
              key="step-7"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              className="space-y-4"
            >
              <h2 className="font-medium text-gray-800">สถานที่ดำเนินงาน</h2>
              <textarea
                className="input min-h-[120px] w-full py-1 px-4 rounded-lg border border-gray-300"
                placeholder="สถานที่ดำเนินงาน..."
              />
            </motion.div>
          )}
          {step === 7 && (
            <motion.div
              key="step-8"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              className="space-y-6"
            >
              <div className="flex flex-col lg:gap-2 gap-4">
                <div className="grid lg:flex lg:gap-2 gap-3">
                  <label className="font-medium ">งบประมาณทั้งหมด</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="ระบุจำนวนเงิน"
                      className="ml-2 w-40 border-b border-gray-400 focus:outline-none text-center"
                    />
                    บาท
                  </div>
                </div>

                <div className="grid lg:flex flex-wrap gap-4">
                  <span className="font-medium">แหล่งงบประมาณ </span>
                  <label className="flex items-center gap-1">
                    <input type="checkbox" className="h-4 w-4" />
                    <span>งบสถานศึกษา</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input type="checkbox" className="h-4 w-4" />
                    <span>เงินรายได้</span>
                  </label>
                  <label className="grid lg:flex items-center gap-1">
                    <div className="flex gap-2 item-center">
                      <input type="checkbox" className="h-4 w-4" />
                      <span>ภายนอก (ระบุหน่วยงาน)</span>
                    </div>
                    <input
                      type="text"
                      placeholder="เช่น กระทรวงศึกษา"
                      className="ml-2 w-56 border-b border-gray-400 focus:outline-none"
                    />
                  </label>
                </div>
              </div>
              <ActivityBudgetTable />
            </motion.div>
          )}
          {step === 8 && (
            <motion.div
              key="step-9"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              className="space-y-4"
            >
              <KPIActivitiesTable value={rowsKPI} onChange={setRowKPI} />
            </motion.div>
          )}

          {step === 9 && (
            <motion.div
              key="step-10"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              className="space-y-4"
            >
              <h2 className="font-medium text-gray-800">
                ตัวชี้วัดผลผลิต (Output Indicators):{" "}
              </h2>
              <textarea
                className="input min-h-[120px] w-full py-1 px-4 rounded-lg border border-gray-300"
                placeholder="ตัวชี้วัดผลผลิต..."
              />
              <h2 className="font-medium text-gray-800">
                ตัวชี้วัดผลลัพธ์ (Outcome Indicators):{" "}
              </h2>
              <textarea
                className="input min-h-[120px] w-full py-1 px-4 rounded-lg border border-gray-300"
                placeholder="ตัวชี้วัดผลลัพธ์..."
              />
            </motion.div>
          )}
          {step === 10 && (
            <motion.div
              key="step-11"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              className="space-y-6"
            >
              <FollowUpEvaluationForm />
            </motion.div>
          )}
          {step === 11 && (
            <motion.div
              key="step-12"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              className="space-y-4"
            >
              <h2 className="font-medium text-gray-800">ผลที่คาดว่าจะได้รับ</h2>
              <textarea
                className="input min-h-[120px] w-full py-1 px-4 rounded-lg border border-gray-300"
                placeholder="ผลที่คาดว่าจะได้รับ..."
              />
            </motion.div>
          )}
          {step === 12 && (
            <motion.div
              key="step-13"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              className="space-y-4"
            >
              <h2 className="font-medium text-gray-800">
                ข้อเสนอแนะ / การพัฒนาในอนาคต
              </h2>
              <textarea
                className="input min-h-[120px] w-full py-1 px-4 rounded-lg border border-gray-300"
                placeholder="ข้อเสนอแนะ..."
              />
            </motion.div>
          )}
          {step === 13 && (
            <motion.div
              key="step-14"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              className="space-y-4"
            >
              <h2 className="font-medium text-gray-800">การอนุมัติและลงนาม</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex gap-3 items-center">
                  <label className="text-sm text-gray-700">ผู้เสนอ</label>
                  <input
                    className="px-4 py-1 border rounded-lg border-gray-300"
                    placeholder="...."
                  />
                </div>
                <div className="flex gap-3 items-center">
                  <label className="text-sm text-gray-700">ตำแหน่ง</label>
                  <input
                    className="px-4 py-1 border rounded-lg border-gray-300"
                    placeholder="...."
                  />
                </div>
                <div className="flex gap-3 items-center">
                  <label className="text-sm text-gray-700">วันที่เสนอ</label>
                  <input
                    className="px-4 py-1 border rounded-lg border-gray-300"
                    placeholder="....."
                  />
                </div>
              </div>
              <div className="grid gap-4">
                <div className="flex gap-3 items-center">
                  <label className="text-sm text-gray-700">
                    ความคิดเห็นของหัวหน้างาน/แผนก
                  </label>
                  <input
                    className="px-4 py-1 border rounded-lg border-gray-300"
                    placeholder="....."
                  />
                </div>
                <div className="flex gap-3 items-center">
                  <label className="text-sm text-gray-700">
                    ความคิดเห็นของผู้บริหาร / ผู้อำนวยการสถานศึกษา
                  </label>
                  <input
                    className="px-4 py-1 border rounded-lg border-gray-300"
                    placeholder="Department"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={prev}
          disabled={step === 0}
          className="flex items-center gap-1 text-gray-700 hover:text-gray-900 disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" /> ย้อนกลับ
        </button>

        {step < steps.length - 1 ? (
          <button
            onClick={next}
            className="inline-flex items-center gap-1 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            ถัดไป <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-800 hover:bg-gray-50">
              <Save className="h-4 w-4" /> บันทึก Draft
            </button>
            <button className="inline-flex items-center gap-1 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700">
              <Send className="h-4 w-4" /> ส่งอนุมัติ
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

function inputClass() {
  return "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500";
}
