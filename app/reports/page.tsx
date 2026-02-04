import { ReportMonthlyArea } from "@/components/reports/txn-monthly-chart";
import { ReportCategoryPie } from "@/components/reports/txn-category-pie";
import { ReportSummaryCards } from "@/components/reports/txn-summary-cards"
import { ReportNetWorthLine } from "@/components/reports/report-networth-line"
import { ExportReportButton } from "@/components/reports/export-report-button"
import { ReportPaymentBar } from "@/components/reports/txn-payment-bar";


export default function ReportsPage() {
  return (
    <div className="container mx-auto py-10 space-y-8">
      
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Financial Reports</h1>
        <ExportReportButton />
      </div>

      {/* 👇 EVERYTHING inside this gets exported */}
      <div id="report-content" className="space-y-8">
        <ReportSummaryCards />

        <div className="grid gap-6 md:grid-cols-2">
          <ReportMonthlyArea />
          <ReportCategoryPie />
        </div>

        <ReportPaymentBar />
        <ReportNetWorthLine />
      </div>
    </div>
  )
}
