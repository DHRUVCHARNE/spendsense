import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="p-6 space-y-6">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-40" />   {/* "Categories" title */}
        <Skeleton className="h-10 w-28" />  {/* Add Category button */}
      </div>

      {/* Table Skeleton */}
      <div className="rounded-md border">
        {/* Table header */}
        <div className="border-b p-4 flex gap-4">
          <Skeleton className="h-5 w-1/4" />
          <Skeleton className="h-5 w-1/4" />
          <Skeleton className="h-5 w-1/4" />
          <Skeleton className="h-5 w-16 ml-auto" />
        </div>

        {/* Table rows */}
        <div className="divide-y">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="p-4 flex gap-4 items-center">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-8 w-8 ml-auto rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
