"use client"

import { PieChart, Pie } from "recharts"
import { api } from "@/lib/trpc/client"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export function ReportCategoryPie() {
  const { data } = api.txn.categoryBreakdown.useQuery({})

  const chartData = data;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{}}>
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent />} />
            <Pie data={chartData} dataKey="value" nameKey="name" />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
