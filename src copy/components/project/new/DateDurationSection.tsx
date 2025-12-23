import { DateDurationValue } from "@/dto/projectDto";
import * as React from "react";
import { BadgeCreateFormProject } from "../Helper";


type Props = {
  value: DateDurationValue;
  onChange: (next: DateDurationValue) => void;
};

export default function DateDurationSection({ value, onChange }: Props) {
  const { startDate, endDate, durationMonths } = value;
  const computedMonths = calcMonthDiff(startDate, endDate);
  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextStart = e.target.value;
    onChange({
      startDate: nextStart,
      endDate,
      durationMonths: calcMonthDiff(nextStart, endDate),
    });
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextEnd = e.target.value;
    onChange({
      startDate,
      endDate: nextEnd,
      durationMonths: calcMonthDiff(startDate, nextEnd),
    });
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const n = clampInt(parseInt(raw || "0", 10), 0, 600);
    const nextEnd = startDate
      ? formatDate(addMonths(parseDate(startDate), n))
      : endDate;
    onChange({ startDate, endDate: nextEnd, durationMonths: n });
  };

  return (
    <div className="lg:space-y-8 space-y-4">
        <BadgeCreateFormProject title="ระยะเวลาดำเนินงาน" />
      <div className="grid lg:flex gap-5 items-center justify-start">
        <div className="grid lg:flex gap-3 items-center">
          <label className="text-sm text-gray-700">วันเริ่มต้น</label>
          <input
            type="date"
            value={startDate || ""}
            onChange={handleStartChange}
            className="px-4 py-1 border rounded-lg border-gray-300"
          />
        </div>
        <div className="grid lg:flex gap-3 items-center">
          <label className="text-sm text-gray-700">วันที่สิ้นสุด</label>
          <input
            type="date"
            value={endDate || ""}
            onChange={handleEndChange}
            className="px-4 py-1 border rounded-lg border-gray-300"
          />
        </div>
      </div>

      <div className="grid lg:flex gap-3 items-center">
        <label className="text-sm text-gray-700">ระยะเวลา (เดือน)</label>
        <input
          type="number"
          min={0}
          step={1}
          value={computedMonths}
          onChange={handleDurationChange}
          className="px-4 py-1 border rounded-lg border-gray-300 w-28"
          placeholder="0"
        />
      </div>
    </div>
  );
}

function clampInt(n: number, min: number, max: number) {
  if (Number.isNaN(n)) return min;
  return Math.max(min, Math.min(max, n | 0));
}

function parseDate(iso?: string): Date | null {
  if (!iso) return null;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
}

function formatDate(d: Date | null): string {
  if (!d) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function addMonths(d: Date | null, months: number): Date | null {
  if (!d) return null;
  const nd = new Date(d);
  const targetMonth = nd.getMonth() + months;
  nd.setMonth(targetMonth);
  if (((nd.getMonth() % 12) + 12) % 12 !== ((targetMonth % 12) + 12) % 12) {
    nd.setDate(0);
  }
  return nd;
}

function calcMonthDiff(startISO?: string, endISO?: string): number {
  const s = parseDate(startISO);
  const e = parseDate(endISO);
  if (!s || !e) return 0;

  let months =
    (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth());
  if (e.getDate() < s.getDate()) months -= 1;
  return Math.max(0, months);
}
