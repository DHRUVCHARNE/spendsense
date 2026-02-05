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

export function ReportsDashboardClient() {
    const [currency, setCurrency] = useState("INR")
    const [filters, setFilters] = useState<{ from?: Date; to?: Date }>({})

    const { data, isLoading } = api.txn.reportDashboard.useQuery({
        currency,
        from: filters.from,
        to: filters.to,
    })


    if (isLoading) return <div className="p-10">Loading reports...</div>
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
