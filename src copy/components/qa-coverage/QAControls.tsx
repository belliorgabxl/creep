"use client";
import React from "react";
import { Search } from "lucide-react";

type Props = {
  query: string;
  setQuery: (q: string) => void;
};
export default function QAControls({ query, setQuery }: Props) {
  return (
    <section className="mt-6 flex flex-col items-stretch justify-between gap-3 md:flex-row md:items-center px-4">
      <div className="relative w-full md:w-1/2">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          placeholder="ค้นหาตามโค้ด/ชื่อตัวบ่งชี้…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-sm text-slate-700 shadow-sm placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-100"
        />
      </div>
    </section>
  );
}
