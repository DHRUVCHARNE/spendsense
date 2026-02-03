"use client"

import { useState, useTransition } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Field, FieldGroup, FieldLabel, FieldDescription } from "../ui/field"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Spinner } from "../ui/spinner"
import { toast } from "sonner"
import { updateCategoryAction } from "@/app/actions/actions"
import { api } from "@/lib/trpc/client"
import { Tag } from "lucide-react"
import z from "zod"
import { updateCategorySchema } from "@/lib/db/zod-schema"
import { useCategoryStore } from "@/app/store/categories-store"

export default function UpdateCategoryForm(
  options: z.infer<typeof updateCategorySchema> & {
    open: boolean
    setOpen: (v: boolean) => void
  }
) {
  const [name, setName] = useState(options.data.name ?? "")
  const [color, setColor] = useState(options.data.color ?? "#6366f1")
  const [isPending, startTransition] = useTransition()
  const utils = api.useUtils()
  const upsert = useCategoryStore((s)=>s.upsert);
  function handleSubmit() {
  const trimmedName = name.trim()
  const hasNameChanged = trimmedName !== (options.data.name ?? "")
  const hasColorChanged = color !== (options.data.color ?? "")

  if (!hasNameChanged && !hasColorChanged) {
    toast("No changes to update")
    return
  }

  startTransition(async () => {
    const formData = new FormData()
    formData.append("id", options.id)

    if (hasNameChanged) formData.append("data.name", trimmedName)
    if (hasColorChanged) formData.append("data.color", color)

    const res = await updateCategoryAction(formData)

    if (res?.ok && res.data) {
      upsert(res.data)                 // ✅ instant store update
      toast.success("Category updated 🎨")
      utils.category.list.invalidate() // optional background sync
      options.setOpen(false)
    } else {
      toast.error(res?.message ?? "Failed to update category")
    }
  })
}

  return (
    <Dialog open={options.open} onOpenChange={options.setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Edit Category
          </DialogTitle>
          <DialogDescription>
            Update category details and color.
          </DialogDescription>
        </DialogHeader>

        <FieldGroup>
          <Field>
            <FieldLabel>Category Name</FieldLabel>
            <FieldDescription>
              Rename the category used across your transactions
            </FieldDescription>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>

          <Field>
            <FieldLabel>Color</FieldLabel>
            <FieldDescription>
              This color is used in charts and labels
            </FieldDescription>

            <div className="flex items-center gap-3">
              <Input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-10 w-16 p-1"
              />
              <span
                className="h-6 w-6 rounded-full border"
                style={{ backgroundColor: color }}
              />
            </div>
          </Field>
        </FieldGroup>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => options.setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? <Spinner /> : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
