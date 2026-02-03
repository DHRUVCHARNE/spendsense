"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { useState } from "react"
import { Button } from "../ui/button"
import { MoreHorizontal, Pen, Trash, Check, Copy, Tag } from "lucide-react"
import { toast } from "sonner"
import UpdateCategoryForm from "./update-cat"
import DeleteCategory from "./delete-cat"
import { CategoryMeta } from "@/app/store/categories-store"

function copyCategory(cat: CategoryMeta) {
  return navigator.clipboard.writeText(JSON.stringify(cat, null, 2))
}

export default function CategoryActionsCell({ category }: { category: CategoryMeta }) {
  const [openEdit, setOpenEdit] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await copyCategory(category)
      setCopied(true)
      toast.success("Category copied to clipboard")
      setTimeout(() => setCopied(false), 1500)
    } catch {
      toast.error("Clipboard permission denied")
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="opacity-60 hover:opacity-100"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuLabel className="flex items-center gap-2">
            <Tag className="h-3 w-3" /> Category Actions
          </DropdownMenuLabel>

          <DropdownMenuItem onClick={handleCopy} disabled={copied}>
            {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
            {copied ? "Copied" : "Copy"}
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => setOpenEdit(true)}>
            <Pen className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setOpenDelete(true)} className="text-red-600">
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UpdateCategoryForm
        open={openEdit}
        setOpen={setOpenEdit}
        id={category.id}
        data={{
            name:category.name,
            color:category.color ?? undefined
        }}
      />

      <DeleteCategory
        id={category.id}
        open={openDelete}
        setOpen={setOpenDelete}
      />
    </>
  )
}
