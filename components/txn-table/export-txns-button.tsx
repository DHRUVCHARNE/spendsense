"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { Txn } from "./columns"

export function ExportTxnsButton({ txns }: { txns: Txn[] }) {
  function handleExport() {
    const blob = new Blob([JSON.stringify(txns, null, 2)], {
      type: "application/json",
    })

    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `transactions-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Button variant="outline" onClick={handleExport}>
      <Download className="w-4 h-4 mr-2" />
      Export JSON
    </Button>
  )
}
