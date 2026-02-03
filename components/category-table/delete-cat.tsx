"use client"

import z from "zod"
import { deleteCategorySchema } from "@/lib/db/zod-schema"
import { Button } from "../ui/button"
import { deleteCategoryAction } from "@/app/actions/actions"
import { toast } from "sonner"
import { useTransition } from "react"
import { Spinner } from "../ui/spinner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog"
import { api } from "@/lib/trpc/client"
import { Tag } from "lucide-react"
import { useCategoryStore } from "@/app/store/categories-store";

export default function DeleteCategory({
  id,
  open,
  setOpen,
}: z.infer<typeof deleteCategorySchema> & {
  open: boolean
  setOpen: (v: boolean) => void
}) {
  const [pending, startTransition] = useTransition()
  const utils = api.useUtils()
  const remove = useCategoryStore((s)=>s.remove);
  if (!id) return null

  const handleDelete = () => {
    startTransition(async () => {
      const formData = new FormData()
      formData.append("id", id)

      const res = await deleteCategoryAction(formData)

      if (res?.ok && res.data) {
        toast.success("Category deleted 🗑️")
        remove(res.data.id);
        utils.category.list.invalidate()
        utils.txn.list.invalidate() // important if txns display category names
        setOpen(false)
      } else {
        toast.error(res?.message ?? "Failed to delete category")
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-red-600 flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Delete Category?
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. Deleting this category may affect
            transactions linked to it.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={pending}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={pending}
          >
            {pending ? <Spinner className="h-4 w-4" /> : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
