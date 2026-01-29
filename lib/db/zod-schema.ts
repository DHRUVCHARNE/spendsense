import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { categories, txns } from "./schema";
import { string, z } from "zod";

export const categoriesSelectSchema = createSelectSchema(categories);
export const createCategorySchema = createInsertSchema(categories,{
  name:z.string().min(1),
  color:z.string().min(1).optional()
}).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});
export const updateCategorySchema = z.object({
  id: z.uuid(),
  data: createUpdateSchema(categories, {
    name: string().min(1).optional(),
    color:z.string().min(1).optional()
  })
    .omit({ id: true, userId: true, createdAt: true, updatedAt: true })
    .refine((val) => Object.keys(val).length > 0, {
      error: "Atleast one field must be updated",
    }),
});
export const deleteCategorySchema = z.object({
  id:z.uuid()
});
export const txnSelectSchema = createSelectSchema(txns);
export const txnInsertSchema = createInsertSchema(txns, {
  amountPaise: z.coerce.number().int().positive(),
}).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});
export const txnUpdateSchema = z.object({
  id: z.uuid(),
  data: createUpdateSchema(txns, {
    amountPaise: z.number().int().positive().optional(),
  })
    .omit({
      id: true,
      userId: true,
      createdAt: true,
      updatedAt: true,
    })
    .refine((val) => Object.keys(val).length > 0, {
      error: "Atleast one field must be updated",
    }),
});

export const txnDeleteSchema = z.object({
  id: z.uuid(),
});

export const userDeleteSchema = z.object({
  id: z.uuid(),
});
