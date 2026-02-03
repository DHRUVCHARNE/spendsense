"use client"

import { useEffect } from "react"
import { api } from "@/lib/trpc/client"
import { useCategoryStore } from "@/app/store/categories-store"

export default function CategoryHydrator({ userId }: { userId: string }) {
  const hydrate = useCategoryStore((s) => s.hydrate)
  const hasHydrated = useCategoryStore((s) => s.categoriesArr.length > 0)

  const query = api.category.list.useInfiniteQuery(
    { sort: "asc" },
    {
      enabled: !!userId && !hasHydrated,
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
      staleTime: Infinity,
    }
  )

  useEffect(() => {
    if (!query.data) return

    const allCats = query.data.pages.flatMap((p) => p.items)
    hydrate(allCats)

    if (query.hasNextPage && !query.isFetchingNextPage) {
      query.fetchNextPage()
    }
  }, [query.data, query.hasNextPage, query.isFetchingNextPage, hydrate, query.fetchNextPage])

  return null
}