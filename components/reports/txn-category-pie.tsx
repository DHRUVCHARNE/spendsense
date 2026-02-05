"use client"

import { PieChart, Pie } from "recharts"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

type Props = {
  categories: { name: string; value: number; fill: string }[];
  currency: string;
}

export function ReportCategoryPie({ categories }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{}}>
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent />} />
            <Pie data={categories} dataKey="value" nameKey="name" />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
