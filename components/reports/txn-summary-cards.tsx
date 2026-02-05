"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Props = {
  summary: { income: number; expense: number }
  currency: string
}

export function ReportSummaryCards({ summary, currency }: Props) {
  const income = summary.income
  const expense = summary.expense
  const balance = income - expense

  const format = (v: number) =>
    new Intl.NumberFormat(undefined, { style: "currency", currency }).format(v)

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card><CardHeader><CardTitle>Total Income</CardTitle></CardHeader><CardContent>{format(income)}</CardContent></Card>
      <Card><CardHeader><CardTitle>Total Expense</CardTitle></CardHeader><CardContent>{format(expense)}</CardContent></Card>
      <Card><CardHeader><CardTitle>Net Balance</CardTitle></CardHeader><CardContent>{format(balance)}</CardContent></Card>
    </div>
  )
}
