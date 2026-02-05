"use client"

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, type ChartConfig } from "@/components/ui/chart"

const chartConfig = {
  income: { label: "Income", color: "var(--chart-2)" },
  expenses: { label: "Expenses", color: "var(--chart-1)" },
  balance: { label: "Balance", color: "var(--chart-3)" },
} satisfies ChartConfig

type Props = {
  trend: { date: string; income: number; expenses: number; balance: number }[]
  currency: string
}

export function ReportMonthlyArea({ trend }: Props) {
  const showDots = trend.length < 2

  return (
    <Card>
      <CardHeader>
        <CardTitle>Income vs Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart data={trend}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={(d) =>
                new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric" })
              }
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />

            <Area
              type="natural"
              dataKey="income"
              stroke="var(--color-income)"
              fill="var(--color-income)"
              fillOpacity={0.25}
              dot={showDots}
            />
            <Area
              type="natural"
              dataKey="expenses"
              stroke="var(--color-expenses)"
              fill="var(--color-expenses)"
              fillOpacity={0.25}
              dot={showDots}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}