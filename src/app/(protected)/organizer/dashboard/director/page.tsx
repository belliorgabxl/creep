"use client"

import { useEffect, useState } from "react"
import { StrategyQaSection } from "@/components/dashboard/StrategyQaSection"
import QuarterCalendar from "@/components/dashboard/QuarterCalendar"
import { ProjectsTable } from "@/components/dashboard/ProjectsTable"
import { ApprovalQueue } from "@/components/dashboard/ApprovalQueue"
import { FooterToolbar } from "@/components/dashboard/FooterToolbar"
import type { GetCalenderEventRespond, GetProjectsByOrgRespond } from "@/api/model/project";
import {
    MOCK_APPROVALS,
} from "@/app/mock"
import { GetQaIndicatorsFromApi,GetStrategicPlansFromApi,GetApprovalItemsFromApi,GetCalendarEventsFromApi } from "@/lib/api/dashboard"
import { GetApprovalItems } from "@/api/model/budget-plan"
import { GetStrategicPlanRespond } from "@/api/model/strategic-plans"
import { GetProjectsByOrgFromApi } from "@/lib/api/dashboard"
import { GetQaIndicatorsRespond } from "@/api/model/qa"

export default function UserDashboardPage() {
    const [filters, setFilters] = useState({
        year: "2568",
        department: "all",
        projectType: "all",
        status: "all",
        qaIndicator: "all",
        strategy: "all",
    })
    const [activeFilters, setActiveFilters] = useState<string[]>([])

    const [calendar_events_data, set_calendar_events_data] = useState<GetCalenderEventRespond[]>([]);
    const [approval_items, set_approval_items] = useState<GetApprovalItems[]>([]);
    const [qa_indicators_data, set_qa_indicators_data] = useState<GetQaIndicatorsRespond[]>([]);
    const [strategic_plans_data, set_strategic_plans_data] = useState<GetStrategicPlanRespond[]>([]);
    const [projects_data, set_projects_data] = useState<GetProjectsByOrgRespond[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    const handleFilterChange = (key: string, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }))
        if (value !== "all" && !activeFilters.includes(key)) {
            setActiveFilters((prev) => [...prev, key])
        } else if (value === "all") {
            setActiveFilters((prev) => prev.filter((f) => f !== key))
        }
    }

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const data = await GetCalendarEventsFromApi();
                console.log("calendar events data:", data);
                set_calendar_events_data(data);
            } catch (err) {
            }
        };
        fetchCounts();
    }, []);

    // useEffect(() => {
    //     const fetchCounts = async () => {
    //         try {
    //             const data = await GetApprovalItemsFromApi();
    //             set_approval_items(data);
    //         } catch (err) {
    //         }
    //     };
    //     fetchCounts();
    // }, []);
    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const data = await GetStrategicPlansFromApi();
                set_strategic_plans_data(data);
            } catch (err) {
            }
        };
        fetchCounts();
    }, []);
    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const data = await GetProjectsByOrgFromApi();
                set_projects_data(data);
            } catch (err) {
            }
        };
        fetchCounts();
    }, []);
    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const data = await GetQaIndicatorsFromApi();
                set_qa_indicators_data(data);
            } catch (err) {
            }
        };
        fetchCounts();
    }, []);


    const clearAllFilters = () => {
        setFilters({
            year: "2568",
            department: "all",
            projectType: "all",
            status: "all",
            qaIndicator: "all",
            strategy: "all",
        })
        setActiveFilters([])
    }

    return (
        <div className="min-h-screen text-gray-900">
            <div className="sticky top-0 z-20 border-b border-gray-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/80">
                <div className="container mx-auto px-4">
                    <div className="flex h-14 items-center justify-between">
                        <h1 className="text-lg font-semibold tracking-tight">Dashboard (director)</h1>
                        <div className="text-xs text-gray-500">
                            ปีงบประมาณ: <span className="font-medium text-gray-700">{filters.year}</span>
                        </div>
                    </div>
                </div>
                <main className="container mx-auto space-y-6 px-4 py-6">
                    <ProjectsTable filters={filters} projects={projects_data} />
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <div className="lg:col-span-2">
                            <ApprovalQueue filters={filters} approvals={MOCK_APPROVALS} />
                        </div>
                        <div>
                            <StrategyQaSection
                                strategies={strategic_plans_data}
                                qaIndicators={qa_indicators_data}
                                onFilterChange={handleFilterChange}
                            />
                        </div>
                    </div>

                    <QuarterCalendar events={calendar_events_data} />
                </main>

            </div>
        </div>
    )
}
