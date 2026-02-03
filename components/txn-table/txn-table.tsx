"use client"
import { useTxns } from "@/lib/txn-service/hooks/useTxns"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { useState } from "react";
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext, PaginationLink, PaginationEllipsis } from "../ui/pagination";

function getVisiblePages(current: number, total: number) {
  const delta = 1 // how many pages around current
  const range: (number | "ellipsis")[] = []

  const left = Math.max(0, current - delta)
  const right = Math.min(total - 1, current + delta)

  if (left > 0) {
    range.push(0)
    if (left > 1) range.push("ellipsis")
  }

  for (let i = left; i <= right; i++) {
    range.push(i)
  }

  if (right < total - 1) {
    if (right < total - 2) range.push("ellipsis")
    range.push(total - 1)
  }

  return range
}


export default function TxnsPage() {

  const {
    data,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage
  } = useTxns({limit:5});
  const [pagesIndex, setPagesIndex] = useState(0);
  const pages = data?.pages ?? [];
  const currentPage = pages[pagesIndex]?.items ?? [];
  const visiblePages = getVisiblePages(pagesIndex, pages.length)
  async function handleNext() {
    if (pagesIndex < pages.length - 1) {
      setPagesIndex((p) => p + 1);
      return;
    }
    if (hasNextPage) {
      await fetchNextPage();
      setPagesIndex((p) => p + 1);
    }
  }
  async function handlePrev() {
    if (pagesIndex > 0) {
      setPagesIndex((p) => p - 1);
      return;
    }
    if (hasPreviousPage) {
      await fetchPreviousPage();
    }
  }
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={currentPage} />
      <Pagination>
        <PaginationContent>
          {/* Previous */}
          <PaginationItem>
            <PaginationPrevious
              onClick={handlePrev}
              className={
                pagesIndex === 0 && !hasPreviousPage
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>

          {visiblePages.map((p, i) =>
            p === "ellipsis" ? (
              <PaginationItem key={`ellipsis-${i}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={p}>
                <PaginationLink
                  isActive={pagesIndex === p}
                  onClick={() => setPagesIndex(p)}
                  className="cursor-pointer"
                >
                  {p + 1}
                </PaginationLink>
              </PaginationItem>
            )
          )}

          {/* Ellipsis if more pages exist */}
          {hasNextPage && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {/* Next */}
          <PaginationItem>
            <PaginationNext
              onClick={handleNext}
              className={
                !hasNextPage && pagesIndex === pages.length - 1
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}