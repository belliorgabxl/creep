"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import type { CalendarEvent, CalendarStatus } from "@/app/mock";
const STATUS: Record<CalendarStatus, { label: string; dot: string; chip: string }> = {
  approved: { label: "อนุมัติ",     dot: "bg-emerald-600", chip: "bg-emerald-100 text-emerald-700" },
  pending:  { label: "รอดำเนินการ", dot: "bg-amber-600",   chip: "bg-amber-100 text-amber-700"   },
  closed:   { label: "ปิดแล้ว",       dot: "bg-gray-500",    chip: "bg-gray-100 text-gray-700"     },
};

type Props = {
  events: CalendarEvent[];                      
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

  const [viewYear, setViewYear]   = useState<number>(initial?.year ?? (startFromToday ? today.getFullYear() : today.getFullYear()));
  const [viewMonth, setViewMonth] = useState<number>(initial?.month ?? (startFromToday ? today.getMonth() : today.getMonth()));

  const monthNames = ["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"];
  const weekdays   = ["จ", "อ", "พ", "พฤ", "ศ", "ส", "อา"];

  const cells = useMemo(() => buildMonthMatrix(viewYear, viewMonth), [viewYear, viewMonth]);

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

  function eventsOnDay(d: Date) {
  return events.filter((ev) => {
    const s = new Date(ev.start);
    const e = new Date(ev.end);
    const isStart = s.toDateString() === d.toDateString();
    const isEnd = e.toDateString() === d.toDateString();
    return isStart || isEnd;
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
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4 text-gray-500" />
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="inline-flex items-center justify-center rounded-md border border-gray-200 bg-white p-2 hover:bg-gray-50">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="min-w-[9rem] text-center text-sm font-semibold text-gray-800">
            {monthNames[viewMonth]} {viewYear + 543}
          </div>
          <button onClick={nextMonth} className="inline-flex items-center justify-center rounded-md border border-gray-200 bg-white p-2 hover:bg-gray-50">
            <ChevronRight className="h-4 w-4" />
          </button>
          <button onClick={goToday} className="ml-2 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm hover:bg-gray-50">
            วันนี้
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 px-4 py-3">
        {Object.entries(STATUS).map(([k, v]) => (
          <span key={k} className={`inline-flex items-center gap-2 rounded-md px-2.5 py-1 text-xs font-medium ${v.chip}`}>
            <span className={`h-2.5 w-2.5 rounded-full ${v.dot}`} />
            {v.label}
          </span>
        ))}
      </div>

      <div className="px-4 pb-4">
        <div className="grid grid-cols-7 gap-px rounded-t-lg bg-gray-200">
          {weekdays.map((w) => (
            <div key={w} className="bg-white py-2 text-center text-xs font-medium text-gray-500">
              {w}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-px rounded-b-lg bg-gray-200">
          {cells.map(({ date, inMonth }, idx) => {
            const inCurrentMonth = inMonth;
            const dayEvents = inCurrentMonth ? eventsOnDay(date) : [];
            const isTodayCell = inCurrentMonth && isSameDay(date, today);

            return (
              <div key={idx} className={`min-h-[92px] bg-white p-1.5 ${inCurrentMonth ? "text-gray-900" : "text-gray-300"}`}>
                <div className="flex items-center justify-between">
                  <span className={`text-xs ${isTodayCell ? "font-semibold text-indigo-600" : ""}`}>
                    {date.getDate()}
                  </span>
                  {isTodayCell && (
                    <span className="rounded-full bg-indigo-100 px-1.5 py-0.5 text-[10px] font-medium text-indigo-700">
                      วันนี้
                    </span>
                  )}
                </div>
                <div className="mt-1 flex flex-col gap-1">
                  {dayEvents.slice(0, 3).map((e, i) => (
                    <span
                      key={i}
                      className={`inline-flex items-center gap-1 truncate rounded px-1.5 py-0.5 text-[10px] ${STATUS[e.status].chip}`}
                      title={`${e.title} • ${STATUS[e.status].label}`}
                    >
                      <i className={`h-1.5 w-1.5 rounded-full ${STATUS[e.status].dot}`} />
                      <span className="truncate">{e.title}</span>
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
