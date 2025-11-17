// app/(protected)/user/page.tsx
"use client";

import { useState } from "react";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { KpiCards } from "@/components/dashboard/KpiCards";
import { ChartsSection } from "@/components/dashboard/ChartsSection";
import { MiniTimeline } from "@/components/dashboard/MiniTimeline";
import { ApprovalQueue } from "@/components/dashboard/ApprovalQueue";
import { StrategyQaSection } from "@/components/dashboard/StrategyQaSection";
import { ProjectsTable } from "@/components/dashboard/ProjectsTable";
import { FooterToolbar } from "@/components/dashboard/FooterToolbar";
import {
  MOCK_APPROVALS,
  MOCK_BUDGET_BY_DEPT,
  MOCK_PROJECT_TYPES,
  MOCK_PROJECTS,
  MOCK_CALENDAR,
} from "@/app/mock";
import QuarterCalendar from "@/components/dashboard/QuarterCalendar";

export default function UserDashboardPage() {
  const [filters, setFilters] = useState({
    year: "2568",
    department: "all",
    projectType: "all",
    status: "all",
    qaIndicator: "all",
    strategy: "all",
  });
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    if (value !== "all" && !activeFilters.includes(key)) {
      setActiveFilters((prev) => [...prev, key]);
    } else if (value === "all") {
      setActiveFilters((prev) => prev.filter((f) => f !== key));
    }
  };

  const clearAllFilters = () => {
    setFilters({
      year: "2568",
      department: "all",
      projectType: "all",
      status: "all",
      qaIndicator: "all",
      strategy: "all",
    });
    setActiveFilters([]);
  };

  return (
    <div className="text-gray-900 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-lg font-semibold tracking-tight">Dashboard (hr)</h1>
        <div className="text-xs text-gray-500">
          ปีงบประมาณ:{" "}
          <span className="font-medium text-gray-700">{filters.year}</span>
        </div>
      </header>

      <FilterBar
        filters={filters}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        onClearAll={clearAllFilters}
      />

      <KpiCards />

      <ChartsSection
        filters={filters}
        onFilterChange={handleFilterChange}
        dataBudgetByDept={MOCK_BUDGET_BY_DEPT}
        dataProjectTypes={
          MOCK_PROJECT_TYPES as Array<{ name: string; value: number }>
        }
      />

      <MiniTimeline />
{/* 
      <QuarterCalendar events={MOCK_CALENDAR} /> */}

      {/* <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ApprovalQueue filters={filters} approvals={MOCK_APPROVALS} />
        </div>
        <div>
          <StrategyQaSection
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </div>
      </div>

      <ProjectsTable filters={filters} projects={MOCK_PROJECTS} /> */}
    </div>
  );
}
