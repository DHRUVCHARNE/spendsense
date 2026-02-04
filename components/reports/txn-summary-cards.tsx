"use client"

import { api } from "@/lib/trpc/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ReportSummaryCards() {
  const { data } = api.txn.summary.useQuery({})

  const income = (data?.[0]?.income ?? 0) / 100
  const expense = (data?.[0]?.expense ?? 0) / 100
  const balance = income - expense

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card><CardHeader><CardTitle>Total Income</CardTitle></CardHeader><CardContent>₹ {income.toLocaleString()}</CardContent></Card>
      <Card><CardHeader><CardTitle>Total Expense</CardTitle></CardHeader><CardContent>₹ {expense.toLocaleString()}</CardContent></Card>
      <Card><CardHeader><CardTitle>Net Balance</CardTitle></CardHeader><CardContent>₹ {balance.toLocaleString()}</CardContent></Card>
    </div>
  )
}
