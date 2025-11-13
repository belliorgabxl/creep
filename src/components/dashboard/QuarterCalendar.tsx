"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";

// ====== ข้อมูลชนิดของ event ======
export type CalendarEventModel = {
  id: string;
  title: string;
  start_date: Date | string;
  plan_id?: string;
  end_date?: Date | string;
  department?: string;
  status?: string;
};

// ====== สีและข้อความสำหรับวันเริ่ม/สิ้นสุด ======
const EVENT_TYPE = {
  start: { label: "วันเริ่มโครงการ", chip: "bg-green-100 text-green-700", dot: "bg-green-600" },
  end: { label: "วันสิ้นสุดโครงการ", chip: "bg-rose-100 text-rose-700", dot: "bg-rose-600" },
};

type Props = {
  events: CalendarEventModel[];
  title?: string;
  startFromToday?: boolean;
  initial?: { year: number; month: number };
};

export default function MonthCalendar({
  events,
  title = "กำหนดการสำคัญ",
  startFromToday = true,
  initial,
}: Props) {
  const today = new Date();

  const [viewYear, setViewYear] = useState<number>(initial?.year ?? today.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(initial?.month ?? today.getMonth());

  const monthNames = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",
  ];

  const cells = useMemo(() => buildMonthMatrix(viewYear, viewMonth), [viewYear, viewMonth]);

  // ====== normalize event ======
  const normalized = useMemo(() => {
    return events
      .map((e) => {
        const start = e.start_date ? new Date(e.start_date) : null;
        const end = e.end_date ? new Date(e.end_date) : null;
        return { raw: e, start, end };
      })
      .filter((item) => {
        if (!item.start || Number.isNaN(item.start.getTime())) return false;
        return true;
      })
      .map(({ raw, start, end }) => ({
        id: String(raw.id),
        title: raw.title ?? "Untitled",
        start: start!,
        end: end && !Number.isNaN(end.getTime()) ? end : start!,
        department: raw.department,
        raw,
      }));
  }, [events]);

  // ====== สร้างตารางวันที่ ======
  function buildMonthMatrix(y: number, m: number) {
    const firstDay = new Date(y, m, 1);
    const startWeekday = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const out: { date: Date; inMonth: boolean }[] = [];

    for (let i = 0; i < startWeekday; i++) {
      const d = new Date(y, m, 1 - (startWeekday - i));
      out.push({ date: d, inMonth: false });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      out.push({ date: new Date(y, m, d), inMonth: true });
    }
    while (out.length < 42) {
      const last = out[out.length - 1].date;
      const next = new Date(last);
      next.setDate(last.getDate() + 1);
      out.push({ date: next, inMonth: false });
    }
    return out;
  }

  // ====== ดึง event ที่เกิดในวันนั้น ======
  function eventsOnDay(d: Date) {
    return normalized.flatMap((ev) => {
      const results = [];
      const isStart = ev.start.toDateString() === d.toDateString();
      const isEnd = ev.end.toDateString() === d.toDateString();
      if (isStart) results.push({ ...ev, kind: "start" as const });
      if (isEnd && ev.end.getTime() !== ev.start.getTime())
        results.push({ ...ev, kind: "end" as const });
      return results;
    });
  }

  function prevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  }

  function goToday() {
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
  }

  const isSameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();

  return (
    <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4 text-gray-500" />
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="inline-flex items-center justify-center rounded-md border border-gray-200 bg-white p-2 hover:bg-gray-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="min-w-[9rem] text-center text-sm font-semibold text-gray-800">
            {monthNames[viewMonth]} {viewYear + 543}
          </div>
          <button
            onClick={nextMonth}
            className="inline-flex items-center justify-center rounded-md border border-gray-200 bg-white p-2 hover:bg-gray-50"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            onClick={goToday}
            className="ml-2 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm hover:bg-gray-50"
          >
            วันนี้
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 px-4 py-3">
        <span
          className={`inline-flex items-center gap-2 rounded-md px-2.5 py-1 text-xs font-medium ${EVENT_TYPE.start.chip}`}
        >
          <span className={`h-2.5 w-2.5 rounded-full ${EVENT_TYPE.start.dot}`} />
          {EVENT_TYPE.start.label}
        </span>
        <span
          className={`inline-flex items-center gap-2 rounded-md px-2.5 py-1 text-xs font-medium ${EVENT_TYPE.end.chip}`}
        >
          <span className={`h-2.5 w-2.5 rounded-full ${EVENT_TYPE.end.dot}`} />
          {EVENT_TYPE.end.label}
        </span>
      </div>

      {/* Calendar grid */}
      <div className="px-4 pb-4">
        <div className="grid grid-cols-7 gap-px rounded-t-lg bg-gray-200">
          {["จ", "อ", "พ", "พฤ", "ศ", "ส", "อา"].map((w) => (
            <div
              key={w}
              className="bg-white py-2 text-center text-xs font-medium text-gray-500"
            >
              {w}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-px rounded-b-lg bg-gray-200">
          {cells.map(({ date, inMonth }, idx) => {
            const dayEvents = inMonth ? eventsOnDay(date) : [];
            const isTodayCell = inMonth && isSameDay(date, today);

            return (
              <div
                key={idx}
                className={`min-h-[92px] bg-white p-1.5 ${
                  inMonth ? "text-gray-900" : "text-gray-300"
                }`}
              >
                {/* date label */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs ${
                      isTodayCell ? "font-semibold text-indigo-600" : ""
                    }`}
                  >
                    {date.getDate()}
                  </span>
                  {isTodayCell && (
                    <span className="rounded-full bg-indigo-100 px-1.5 py-0.5 text-[10px] font-medium text-indigo-700">
                      วันนี้
                    </span>
                  )}
                </div>

                {/* events */}
                <div className="mt-1 flex flex-col gap-1">
                  {dayEvents.slice(0, 3).map((e, i) => (
                    <span
                      key={i}
                      className={`inline-flex items-center gap-1 truncate rounded px-1.5 py-0.5 text-[10px] ${
                        e.kind === "start"
                          ? EVENT_TYPE.start.chip
                          : EVENT_TYPE.end.chip
                      }`}
                      title={`${e.title} • ${
                        e.kind === "start"
                          ? EVENT_TYPE.start.label
                          : EVENT_TYPE.end.label
                      }`}
                    >
                      <i
                        className={`h-1.5 w-1.5 rounded-full ${
                          e.kind === "start"
                            ? EVENT_TYPE.start.dot
                            : EVENT_TYPE.end.dot
                        }`}
                      />
                      <span className="truncate">
                        {e.kind === "start" ? "เริ่ม: " : "สิ้นสุด: "}
                        {e.title}
                      </span>
                    </span>
                  ))}

                  {dayEvents.length > 3 && (
                    <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-600">
                      +{dayEvents.length - 3}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
