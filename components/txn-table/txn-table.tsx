"use client"
import { useTxns } from "@/lib/txn-service/hooks/useTxns"
import { getTxnColumns } from "./columns"
import { DataTable } from "./data-table";
import { useEffect, useMemo } from "react";
import { useState } from "react";
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext, PaginationLink, PaginationEllipsis } from "../ui/pagination";
import { Skeleton } from "../ui/skeleton";
import type { BaseInput } from "@/lib/txn-service/hooks/useTxns";
import { SortingState } from "@tanstack/react-table";
import { ClearTxnFiltersButton } from "./clear-filters";
import { TxnLimitFilter } from "./txn-limit-filter";
import { ActiveTxnFilterBadges } from "./filter-badges";
import { ExportTxnsButton } from "./export-txns-button";
import { TxnSearchBar } from "./txns-search-bar";
import { Badge } from "../ui/badge";
import { List, Search } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";

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
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filters, setFilters] = useState<BaseInput>({
    limit: 10,
    sort: "desc",
    txnType: undefined,
    categoryId: undefined,
    paymentMethod: undefined,
    from: undefined,
    to: undefined,
  });
  const [searchResults, setSearchResults] = useState<any[] | null>(null)
  const [searchQuery, setSearchQuery] = useState("");
  const [clearSearchCounter, setClearSearchCounter] = useState(0);
  const isSearchMode = searchQuery.length > 0;

  const queryParams = useMemo(() => {
    return Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== undefined)
    ) as BaseInput
  }, [filters]);
  useEffect(() => {
    if (sorting[0]) {
      setFilters(f => {
        const nextSort = sorting[0].desc ? "desc" : "asc"
        if (f.sort === nextSort) return f
        return { ...f, sort: nextSort }
      })
    }
  }, [sorting])
  const searchToastId = useRef<string | number | null>(null)
  useEffect(() => {
    if (!isSearchMode) {
      // Exit search mode → dismiss toast
      if (searchToastId.current) {
        toast.dismiss(searchToastId.current)
        searchToastId.current = null
      }
      return
    }

    // If toast already exists → update it
    if (searchToastId.current) {
      toast.message(`Showing results for "${searchQuery}"`, {
        id: searchToastId.current,
        action: {
          label: "Back to all",
          onClick: () => {
            setSearchQuery("")
            setSearchResults(null)
          },
        },
      })
    } else {
      // Create toast only once
      searchToastId.current = toast.message(
        `Showing results for "${searchQuery}"`,
        {
          duration: Infinity, // stays until dismissed
          action: {
            label: "Back to all",
            onClick: () => {
              setSearchQuery("")
              setSearchResults(null)
              setClearSearchCounter(c => c+1)
            },
          },
        }
      )
    }
  }, [isSearchMode, searchQuery])
  const {
    data,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
    isLoading,
    isError,
  } = useTxns(queryParams);
  const [pagesIndex, setPagesIndex] = useState(0);
  const pages = data?.pages ?? [];
  const visiblePages = getVisiblePages(pagesIndex, pages.length);
  const paginatedTxns = pages[pagesIndex]?.items ?? []
  const tableData = isSearchMode ? searchResults ?? [] : paginatedTxns
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
  useEffect(() => {
    if (!isSearchMode) {
      setPagesIndex(0)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }, [queryParams, isSearchMode])
  if (isLoading) {
    return (
      <div className="container mx-auto py-10 space-y-3">
        <Skeleton className="h-8 w-1/3" /> {/* header */}
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    )
  };
  if (isError) {
    return <div className="text-red-500">Failed to load transactions.</div>
  }


  return (
    <>
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <TxnSearchBar onResults={(results, query) => {
            setSearchResults(results)
            setSearchQuery(query)
          }} 
          clearSignal={clearSearchCounter}
          />
          <TxnLimitFilter value={filters.limit} setFilters={setFilters} disabled={isSearchMode} />
          <ClearTxnFiltersButton setFilters={setFilters} />
          <ExportTxnsButton txns={pages.flatMap(p => p.items)} />
        </div>

        <ActiveTxnFilterBadges filters={filters} setFilters={setFilters} />
      </div>
      <div className="container mx-auto py-10">
        <Badge variant={isSearchMode ? "secondary" : "outline"} className="transition-all duration-300 ease-in-out animate-in fade-in slide-in-from-bottom-4">{isSearchMode ? <Search /> : <List />}</Badge>
        <DataTable columns={getTxnColumns(filters, setFilters)} data={tableData}
          sorting={sorting}
          setSorting={setSorting}
        />
        {!isSearchMode && (<Pagination>
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
        </Pagination>)}
      </div>
    </>
  )
}