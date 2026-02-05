"use client"

import { LineChart, Line, XAxis, CartesianGrid } from "recharts"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"

const chartConfig = {
  balance: { label: "Net Balance", color: "var(--chart-3)" },
} satisfies ChartConfig

type Props = {
  trend: { date: string; income: number; expenses: number; balance: number }[]
  currency: string
}

export function ReportNetWorthLine({ trend }: Props) {
  const showDots = trend.length < 2;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Net Balance Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart data={trend} >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={(d) =>
                new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric" })
              }
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              type="natural"
              dataKey="balance"
              stroke="var(--chart-3)"
              strokeWidth={3}
              dot={showDots}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}