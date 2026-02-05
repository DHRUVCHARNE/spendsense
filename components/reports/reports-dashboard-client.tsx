"use client"

import { useState } from "react"
import { api } from "@/lib/trpc/client"
import { POPULAR_CURRENCIES } from "../txn-table/popular-currencies"
import {
    Select, SelectTrigger, SelectValue, SelectContent, SelectItem
} from "@/components/ui/select"
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card"
import { TxnDateRangeFilter } from "../txn-table/txn-date-range-filter"
import { ReportMonthlyArea } from "@/components/reports/txn-monthly-chart"
import { ReportCategoryPie } from "@/components/reports/txn-category-pie"
import { ReportSummaryCards } from "@/components/reports/txn-summary-cards"
import { ReportNetWorthLine } from "@/components/reports/report-networth-line"
import { ReportPaymentBar } from "@/components/reports/txn-payment-bar"
import { Skeleton } from "../ui/skeleton"
export function ReportsDashboardClient() {
    const [currency, setCurrency] = useState("INR")
    const [filters, setFilters] = useState<{ from?: Date; to?: Date }>({})

    const { data, isLoading } = api.txn.reportDashboard.useQuery({
        currency,
        from: filters.from,
        to: filters.to,
    })


    if (isLoading) {
        return (
            <div className="space-y-8">

                {/* Filters row */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-end gap-3">
                    <Skeleton className="h-9 w-56" />
                    <Skeleton className="h-9 w-36" />
                </div>

                {/* Summary cards */}
                <div className="grid gap-6 md:grid-cols-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="rounded-xl border p-6 space-y-4">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-8 w-32" />
                            <Skeleton className="h-3 w-20" />
                        </div>
                    ))}
                </div>

                {/* Charts row */}
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="rounded-xl border p-6 space-y-4">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-64 w-full" />
                    </div>
                    <div className="rounded-xl border p-6 space-y-4">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-64 w-full" />
                    </div>
                </div>

                {/* Full width charts */}
                <div className="rounded-xl border p-6 space-y-4">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-72 w-full" />
                </div>

                <div className="rounded-xl border p-6 space-y-4">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-72 w-full" />
                </div>

            </div>
        )
    }
    if (!data) return null

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-end gap-3">
                <TxnDateRangeFilter
                    from={filters.from}
                    to={filters.to}
                    setFilters={setFilters}
                />
                <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger className="w-36">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {POPULAR_CURRENCIES.map((c) => (
                            <SelectItem key={c.code} value={c.code}>
                                <HoverCard openDelay={10} closeDelay={50}>
                                    <HoverCardTrigger asChild>
                                        <span className="flex gap-2 items-center">
                                            <span>{c.symbol}</span>
                                            <span className="text-xs text-muted-foreground">{c.code}</span>
                                        </span>
                                    </HoverCardTrigger>
                                    <HoverCardContent>{c.name}</HoverCardContent>
                                </HoverCard>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Reports */}
            <div id="report-content" className="space-y-8">
                <ReportSummaryCards summary={data.summary} currency={currency} />

                <div className="grid gap-6 md:grid-cols-2">
                    <ReportMonthlyArea trend={data.trend} currency={currency} />
                    <ReportCategoryPie categories={data.categories} currency={currency} />
                </div>

                <ReportPaymentBar payments={data.payments} currency={currency} />
                <ReportNetWorthLine trend={data.trend} currency={currency} />
            </div>
        </div>
    )
}
