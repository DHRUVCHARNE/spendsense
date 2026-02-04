"use server";
import { eq, type InferSelectModel ,and, sql} from "drizzle-orm";
import { auth } from "@/auth";
import { AppError, BadRequestError, UnauthorizedError } from "@/lib/AppError";
import { db } from "@/lib/db";
import { txns } from "@/lib/db/schema";
import { txnInsertSchema, txnUpdateSchema,txnDeleteSchema } from "@/lib/db/zod-schema";
import { appInfo } from "@/components/config";
import z from "zod";
import { createLimiter, deleteLimiter, updateLimiter } from "@/lib/rate-limit/rate-limit";
import { Guard } from "./action-helper";

type Txn=InferSelectModel<typeof txns>;

export async function createTxn(input: unknown) : Promise<Txn> {
  const session = await Guard(createLimiter,{
      errorMessage:"Too many Requests",
      requireAuth:true
    });
  //Validate Client input
  const data = input as z.infer<typeof txnInsertSchema>;
  

    // 🔒 Count user's transactions
  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(txns)
    .where(eq(txns.userId, session.user.id))

  const count = Number(result[0].count)

  if (count >= appInfo.limitsPerUser.txns) {
    throw new AppError(
      `Transaction limit reached (${appInfo.limitsPerUser.txns} max). Upgrade plan or delete old ones.`,
      "TXN_LIMIT_REACHED",
      400
    )
  }

  //Insert txn
  const [createdTxn] = await db
    .insert(txns)
    .values({
      ...data,
      userId: session.user.id,
    })
    .returning();

    if (!createdTxn) throw new AppError("Insert Txn Failed", "INSERT_FAILED", 500);

    return createdTxn;
}

export async function updateTxn(input:unknown):Promise<Txn>{
  
  const session = await Guard(updateLimiter,{
      errorMessage:"Too many Requests",
      requireAuth:true
    });
  //Validate Client input
  const data = input as z.infer<typeof txnUpdateSchema>;

  const {id,data:payload}=data;
  
  //Update 
  const [updatedTxn]=await db.update(txns).set({
    ...payload
  }).where(
    and(
      eq(txns.id,id),
      eq(txns.userId,session.user.id)
    )
  ).returning();
  
  if (!updatedTxn) throw new AppError("Txn Update Failed", "UPDATE_FAILED", 500);

  return updatedTxn;
}

export async function deleteTxn(input:unknown):Promise<Txn>{
  const session = await Guard(deleteLimiter,{
      errorMessage:"Too many Requests",
      requireAuth:true
    });
  //Validate Client input
  const data = input as z.infer<typeof txnDeleteSchema>;
  const id=data.id;
  const[deletedTxn]=await db.delete(txns).where(and(eq(txns.userId,session.user.id),eq(txns.id,id))).returning();

  if (!deletedTxn) throw new AppError("Txn Delete Failed", "DELETE_FAILED", 500);

  return deletedTxn;
}
