"use server";
/**
 * @author Dhruv4ne
 * @abstract These are Server Actions for DB Mutations
 */
import { createCategorySchema, deleteCategorySchema, txnDeleteSchema, txnInsertSchema, txnUpdateSchema, updateCategorySchema, userDeleteSchema } from "@/lib/db/zod-schema";
import { createTxn, deleteTxn, updateTxn } from "./txn.actions";
import z from "zod";
import { createCategory, deleteCategory, updateCategory } from "./category.actions";
import { deleteUser } from "./user.actions";
/**
 * @description Transaction Actions
 */
export async function createTxnAction(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());

  const parsed = txnInsertSchema.safeParse(raw);
  if (!parsed.success) {
    console.error(z.treeifyError(parsed.error));
    throw new Error("Invalid transaction data");
  }

  await createTxn(parsed.data);
}
export async function updateTxnAction(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());

  const parsed = txnUpdateSchema.safeParse(raw);
  if (!parsed.success) {
    console.error(z.treeifyError(parsed.error));
    throw new Error("Invalid transaction data");
  }

  await updateTxn(parsed.data);
}
export async function deleteTxnAction(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());

  const parsed = txnDeleteSchema.safeParse(raw);
  if (!parsed.success) {
    console.error(z.treeifyError(parsed.error));
    throw new Error("Invalid transaction data");
  }

  await deleteTxn(parsed.data);
}

/**
 * @dev Category Actions
 */
export async function createCategoryAction(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());

  const parsed = createCategorySchema.safeParse(raw);
  if (!parsed.success) {
    console.error(z.treeifyError(parsed.error));
    throw new Error("Invalid transaction data");
  }
  await createCategory(parsed.data);
}
export async function updateCategoryAction(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());

  const parsed = updateCategorySchema.safeParse(raw);
  if (!parsed.success) {
    console.error(z.treeifyError(parsed.error));
    throw new Error("Invalid transaction data");
  }
  await updateCategory(parsed.data);
}
export async function deleteCategoryAction(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());

  const parsed = deleteCategorySchema.safeParse(raw);
  if (!parsed.success) {
    console.error(z.treeifyError(parsed.error));
    throw new Error("Invalid transaction data");
  }
  await deleteCategory(parsed.data);
}
/**
 * @dev User Actions
 */

export async function deleteUserAction(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());

  const parsed = userDeleteSchema.safeParse(raw);
  if (!parsed.success) {
    console.error(z.treeifyError(parsed.error));
    throw new Error("Invalid transaction data");
  }
  await deleteUser(parsed.data);
}