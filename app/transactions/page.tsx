"use client"

import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useTxns } from "@/lib/txn-service/hooks/useTxns"

export default function TxnTable() {
  const txns = useTxns({ limit: 10 })

  if (txns.status === "pending") return <p>Loading...</p>
  if (txns.status === "error") return <p>Error: {txns.error.message}</p>

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Method</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {txns.items.map((txn) => (
            <TableRow key={txn.id}>
              <TableCell>
                {new Date(txn.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>{txn.txnType}</TableCell>
              <TableCell>{txn.paymentMethod}</TableCell>
              <TableCell className="text-right">
                ₹ {(txn.amountPaise ).toFixed(2)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => txns.fetchPreviousPage()}
          disabled={!txns.hasPreviousPage || txns.isFetchingPreviousPage}
        >
          {txns.isFetchingPreviousPage ? "Loading..." : "Previous"}
        </Button>

        <Button
          variant="outline"
          onClick={() => txns.fetchNextPage()}
          disabled={!txns.hasNextPage || txns.isFetchingNextPage}
        >
          {txns.isFetchingNextPage ? "Loading..." : "Next"}
        </Button>
      </div>
    </div>
  )
}
