"use client"

import { Button } from "@/components/ui/button"
import { XCircle } from "lucide-react"
import { BaseInput } from "@/lib/txn-service/hooks/useTxns"

type Props = {
  setFilters: React.Dispatch<React.SetStateAction<BaseInput>>
}

export function ClearTxnFiltersButton({ setFilters }: Props) {
  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={() =>
        setFilters({
          limit: 10,
          sort: "desc",
          txnType: undefined,
          categoryId: undefined,
          paymentMethod: undefined,
          from: undefined,
          to: undefined,
        })
      }
      className="gap-2"
    >
      <XCircle className="h-4 w-4" />
      Clear Filters
    </Button>
  )
}
