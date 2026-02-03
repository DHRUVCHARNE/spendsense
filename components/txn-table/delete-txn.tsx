"use client";

import { txnDeleteSchema } from "@/lib/db/zod-schema";
import z from "zod";
import { Button } from "../ui/button";
import { deleteTxnAction } from "@/app/actions/actions";
import { toast } from "sonner";
import { useTransition, useState } from "react";
import { Spinner } from "../ui/spinner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { api } from "@/lib/trpc/client";

export default function DeleteTxn({
  id,
  open,
  setOpen,
}: z.infer<typeof txnDeleteSchema> & {
  open: boolean
  setOpen: (v: boolean) => void
}) {
  const [pending, startTransition] = useTransition();
  const utils = api.useUtils();
  if (!id) return null;

  const handleDelete = () => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("id", id);

      const res = await deleteTxnAction(formData);

      if (res?.ok) {
        toast.success("Transaction deleted 🗑️");
        utils.txn.list.invalidate();
        setOpen(false);
      } else {
        toast.error(res?.message ?? "Failed to delete transaction");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-red-600">Delete Transaction?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently remove the transaction.
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
  );
}
