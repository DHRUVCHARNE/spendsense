"use client"

import { LineChart, Line, XAxis, CartesianGrid } from "recharts"
import { api } from "@/lib/trpc/client"
import {
  Card, CardHeader, CardTitle, CardContent,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const chartConfig = {
  balance: { label: "Net Balance", color: "var(--chart-3)" },
} satisfies ChartConfig

export function ReportNetWorthLine() {
  const { data = [], isLoading } = api.txn.monthlyStats.useQuery()

  if (isLoading) return <div className="p-6">Loading chart...</div>

  let runningBalance = 0

  const chartData = data.map((r) => {
    runningBalance += r.income - r.expenses

    return {
      month: r.month, // already "Feb 2025"
      balance: runningBalance,
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Net Balance Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey="balance"
              stroke="var(--color-balance)"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
