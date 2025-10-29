"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Save, Send } from "lucide-react";

const steps = [
  "ข้อมูลพื้นฐาน",
  "วัตถุประสงค์ / เป้าหมาย",
  "ตัวชี้วัดความสำเร็จ (KPI)",
  "งบประมาณที่ขอ",
  "QA & Strategy Alignment",
  "แนบไฟล์เอกสาร",
];

export default function CreateProjectPage() {
  const [step, setStep] = useState(0);

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));
  return (
    <main className="mx-auto max-w-5xl px-6 py-0">
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
              className={`text-[11px] mt-1 text-center ${
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
              <div className="grid grid-cols-2 gap-4">
                <div className="flex gap-3 items-center">
                  <label className="text-sm text-gray-700">ชื่อโครงการ</label>
                  <input
                    className="px-4 py-1 border rounded-lg border-gray-300"
                    placeholder="Project name"
                  />
                </div>
                <div className="flex gap-3 items-center">
                  <label className="text-sm text-gray-700">ประเภทโครงการ</label>
                  <select className="px-4 py-1 border rounded-lg border-gray-300">
                    <option>เลือกประเภท</option>
                    <option>Internal</option>
                    <option>External</option>
                  </select>
                </div>
                <div className="flex gap-3 items-center">
                  <label className="text-sm text-gray-700">
                    แผนกที่เกี่ยวข้อง
                  </label>
                  <input
                    className="px-4 py-1 border rounded-lg border-gray-300"
                    placeholder="Department"
                  />
                </div>
                <div className="flex gap-3 items-center">
                  <label className="text-sm text-gray-700">
                    ระยะเวลา (เดือน)
                  </label>
                  <input
                    type="number"
                    className="px-4 py-1 border rounded-lg border-gray-300"
                    placeholder="3"
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
                วัตถุประสงค์ / เป้าหมาย
              </h2>
              <textarea
                className="input min-h-[120px] w-full py-1 px-4 rounded-lg border border-gray-300"
                placeholder="ระบุวัตถุประสงค์ของโครงการ..."
              />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 className="font-medium text-gray-800 mb-2">
                ตัวชี้วัดความสำเร็จ (KPI)
              </h2>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3">
                    <input
                      className="input px-3 py-1 flex-1 border border-gray-300 rounded-lg"
                      placeholder={`ตัวชี้วัดที่ ${i}`}
                    />
                    <input
                      type="number"
                      className="px-3 py-1 border border-gray-300 rounded-lg w-32"
                      placeholder="เป้าหมาย"
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 className="font-medium text-gray-800 mb-2">งบประมาณที่ขอ</h2>
              <input
                type="number"
                className="px-3 py-1 border border-gray-300 rounded-lg w-64"
                placeholder="จำนวนเงิน (บาท)"
              />
              <p className="text-xs text-gray-500 mt-1">*ระบุยอดรวมโดยประมาณ</p>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 className="font-medium text-gray-800 mb-2">
                QA & Strategy Alignment
              </h2>
              <p className="text-sm text-gray-600 mb-3">
                เลือกตัวชี้วัดงานประกันคุณภาพ (QA Indicators)
                และแผนยุทธศาสตร์ที่เกี่ยวข้อง
              </p>
              <div className="space-y-3">
                <fieldset>
                  <legend className="text-sm font-medium mb-1">
                    QA Indicators
                  </legend>
                  <div className="space-y-1">
                    <label className="flex gap-2 items-center">
                      <input type="checkbox" className="w-4 h-4"/> ระบบสารสนเทศมีประสิทธิภาพ
                    </label>
                    <label className="flex gap-2 items-center">
                      <input type="checkbox" className="w-4 h-4"/> การบริการนักศึกษามีคุณภาพ
                    </label>
                    <label className="flex gap-2 items-center">
                      <input type="checkbox" className="w-4 h-4" />{" "}
                      กระบวนการบริหารจัดการมีประสิทธิผล
                    </label>
                  </div>
                </fieldset>

                <fieldset className="mt-3">
                  <legend className="text-sm font-medium mb-1">
                    Strategic Plan
                  </legend>
                  <div className="space-y-1">
                    <label className="flex gap-2 items-center">
                      <input type="checkbox" className="w-4 h-4"/> แผนยุทธศาสตร์ด้านการเรียนรู้
                    </label>
                    <label className="flex gap-2 items-center">
                      <input type="checkbox" className="w-4 h-4"/> แผนยุทธศาสตร์ด้านนวัตกรรม
                    </label>
                    <label className="flex gap-2 items-center">
                      <input type="checkbox" className="w-4 h-4"/> แผนยุทธศาสตร์ด้านบุคลากร
                    </label>
                  </div>
                </fieldset>
              </div>
            </motion.div>
          )}
          {step === 5 && (
            <motion.div
              key="step-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 className="font-medium text-gray-800 mb-2">แนบไฟล์เอกสาร</h2>
              <div className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-gray-300 rounded-xl py-10">
                <p className="text-sm text-gray-500">
                  ลากไฟล์มาวาง หรือคลิกเพื่อเลือกไฟล์
                </p>
                <input type="file" className="hidden" id="file" />
                <label
                  htmlFor="file"
                  className="px-4 py-2 text-sm font-medium bg-gray-800 text-white rounded-md cursor-pointer hover:bg-gray-900"
                >
                  เลือกไฟล์
                </label>
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
