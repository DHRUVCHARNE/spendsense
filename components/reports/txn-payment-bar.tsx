"use client"

import { BarChart, Bar, XAxis, CartesianGrid } from "recharts"
import { api } from "@/lib/trpc/client"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export function ReportPaymentBar() {
  const { data } = api.txn.paymentMethodBreakdown.useQuery();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Methods</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{}}>
          <BarChart data={data}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="method" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="total" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
