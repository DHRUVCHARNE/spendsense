import { categoriesSelectSchema } from "@/lib/db/zod-schema"
import z from "zod"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "../ui/button"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card"
import ActionsCell from "./action-cell"

export type Category = z.infer<typeof categoriesSelectSchema>

function truncate(text: string, limit: number) {
  return text.length > limit ? text.slice(0, limit) + "..." : text
}

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: "name",
    header: "Category",
    cell: ({ row }) => {
      const full = row.original.name
      const short = truncate(full, 20)

      return (
        <HoverCard openDelay={10} closeDelay={50}>
          <HoverCardTrigger asChild>
            <Button variant="link" className="h-auto p-0 font-medium">
              {short}
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-64 text-sm">
            {full}
          </HoverCardContent>
        </HoverCard>
      )
    },
  },
  {
    accessorKey: "color",
    header: "Color",
    cell: ({ row }) => {
      const color = row.original.color

      return color ? (
        <div className="flex items-center gap-2">
          <span
            className="h-3 w-3 rounded-full border"
            style={{ backgroundColor: color }}
          />
          <span className="text-xs text-muted-foreground">{color}</span>
        </div>
      ) : (
        <span className="text-xs text-muted-foreground">Default</span>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt)
      return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell category={row.original} />,
  },
]
