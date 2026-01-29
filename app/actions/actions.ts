"use server";

import { createCategorySchema, txnInsertSchema } from "@/lib/db/zod-schema";
import { createTxn } from "./txn.actions";
import z from "zod";
import { createCategory } from "./category.actions";
export async function createTxnAction(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());

  const parsed = txnInsertSchema.safeParse(raw);
  if (!parsed.success) {
    console.error(z.treeifyError(parsed.error));
    throw new Error("Invalid transaction data");
  }

  await createTxn(parsed.data);
}
export async function createCategoryAction(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());

  const parsed = createCategorySchema.safeParse(raw);
  if (!parsed.success) {
    console.error(z.treeifyError(parsed.error));
    throw new Error("Invalid transaction data");
  }
  await createCategory(parsed.data);
}
