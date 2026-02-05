"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
} from "recharts"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

type Props = {
  payments: { method: string; total: number }[]
  currency: string
}

const chartConfig = {
  total: { label: "Amount", color: "var(--chart-1)" }, // 🌗 auto theme-aware
} satisfies ChartConfig

export function ReportPaymentBar({ payments, currency }: Props) {
  const sortedPayments = [...payments].sort((a, b) => b.total - a.total)

  const format = (v: number) =>
    new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(v)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Methods</CardTitle>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="h-70 w-full">
          <BarChart
            data={sortedPayments}
            margin={{ top: 20, right: 10, left: 0, bottom: 0 }}
            barCategoryGap="28%"
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />

            <XAxis
              dataKey="method"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={format}
              width={90}
            />

            <ChartTooltip
              cursor={{ fill: "rgba(0,0,0,0.04)" }}
              content={
                <ChartTooltipContent
                  formatter={(value) => format(Number(value))}
                  indicator="dot"
                />
              }
            />

            <Bar
              dataKey="total"
              fill="var(--color-total)"  
              radius={[10, 10, 0, 0]}
              animationDuration={800}
            >
              <LabelList
                dataKey="total"
                position="top"
                formatter={format}
                className="fill-muted-foreground text-xs"
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
