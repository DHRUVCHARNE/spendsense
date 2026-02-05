import { ReportsDashboardClient } from "@/components/reports/reports-dashboard-client";
import { cachedAuth } from "@/lib/authUtils";
import { redirect } from "next/navigation";
export default async function ReportsPage() {
  const session = await cachedAuth()
  if (!session) redirect("/")

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Financial Reports</h1>
      </div>

      <ReportsDashboardClient />
    </div>
  )
}
