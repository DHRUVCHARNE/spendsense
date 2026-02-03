"use server";
/**
 * @author Dhruv4ne
 * @abstract These are Server Actions for DB Mutations
 */
import { createCategorySchema, deleteCategorySchema, txnDeleteSchema, txnInsertSchema, txnUpdateSchema, updateCategorySchema, userDeleteSchema } from "@/lib/db/zod-schema";
import { createTxn, deleteTxn, updateTxn } from "./txn.actions";
import { createCategory, deleteCategory, updateCategory } from "./category.actions";
import { deleteUser } from "./user.actions";
import { handleAction } from "./action-helper";
/**
 * @description Transaction Actions
 */
export const createTxnAction = async (formData: FormData) =>
  handleAction(formData, txnInsertSchema, createTxn, {
    revalidate: "/",
    invalidMessage: "Invalid transaction data",
    errorMessage: "Failed to create transaction",
  });

export const updateTxnAction = async (formData: FormData) =>
  handleAction(formData, txnUpdateSchema, updateTxn, {
    revalidate: "/",
    invalidMessage: "Invalid transaction data",
    errorMessage: "Failed to update transaction",
  });

export const deleteTxnAction = async (formData: FormData) =>
  handleAction(formData, txnDeleteSchema, deleteTxn, {
    revalidate: "/",
    invalidMessage: "Invalid transaction data",
    errorMessage: "Failed to delete transaction",
  });

/**
 * @dev Category Actions
 */
export const createCategoryAction = async (formData: FormData) =>
  handleAction(formData, createCategorySchema, createCategory, {
    revalidate: "/",
    invalidMessage: "Invalid category data",
    errorMessage: "Failed to create category",
  });

export const updateCategoryAction = async (formData: FormData) =>
  handleAction(formData, updateCategorySchema, updateCategory, {
    revalidate: "/",
    invalidMessage: "Invalid category data",
    errorMessage: "Failed to update category",
  });

export const deleteCategoryAction = async (formData: FormData) =>
  handleAction(formData, deleteCategorySchema, deleteCategory, {
    revalidate: "/",
    invalidMessage: "Invalid category data",
    errorMessage: "Failed to delete category",
  });
/**
 * @dev User Actions
 */
export const deleteUserAction = async (formData: FormData) =>
  handleAction(formData, userDeleteSchema, deleteUser, {
    revalidate: "/",
    invalidMessage: "Invalid user data",
    errorMessage: "Failed to delete user",
  });
