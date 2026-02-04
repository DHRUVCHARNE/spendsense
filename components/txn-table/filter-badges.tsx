"use client"

import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { BaseInput } from "@/lib/txn-service/hooks/useTxns"
import { format } from "date-fns"
import { useCategoryStore } from "@/app/store/categories-store"

type Props = {
  filters: BaseInput
  setFilters: React.Dispatch<React.SetStateAction<BaseInput>>
}

export function ActiveTxnFilterBadges({ filters, setFilters }: Props) {
  const categories = useCategoryStore(s => s.categories)

  const remove = (key: keyof BaseInput) => {
    setFilters(f => ({ ...f, [key]: undefined }))
  }

  return (
    <div className="flex flex-wrap gap-2">
      {filters.txnType && (
        <Badge variant="secondary" className="gap-1">
          Type: {filters.txnType}
          <X className="h-3 w-3 cursor-pointer" onClick={() => remove("txnType")} />
        </Badge>
      )}

      {filters.categoryId && (
        <Badge variant="secondary" className="gap-1">
          Category: {categories[filters.categoryId]?.name ?? "Unknown"}
          <X className="h-3 w-3 cursor-pointer" onClick={() => remove("categoryId")} />
        </Badge>
      )}

      {filters.paymentMethod && (
        <Badge variant="secondary" className="gap-1">
          Method: {filters.paymentMethod}
          <X className="h-3 w-3 cursor-pointer" onClick={() => remove("paymentMethod")} />
        </Badge>
      )}

      {filters.from && (
        <Badge variant="outline" className="gap-1">
          From: {format(filters.from, "dd MMM yyyy")}
          <X className="h-3 w-3 cursor-pointer" onClick={() => remove("from")} />
        </Badge>
      )}

      {filters.to && (
        <Badge variant="outline" className="gap-1">
          To: {format(filters.to, "dd MMM yyyy")}
          <X className="h-3 w-3 cursor-pointer" onClick={() => remove("to")} />
        </Badge>
      )}

      {filters.limit && filters.limit !== 10 && (
        <Badge variant="outline" className="gap-1">
          Limit: {filters.limit}
          <X className="h-3 w-3 cursor-pointer" onClick={() => remove("limit")} />
        </Badge>
      )}
    </div>
  )
}
