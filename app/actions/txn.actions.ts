"use server";
import { eq, type InferSelectModel ,and} from "drizzle-orm";
import { auth } from "@/auth";
import { AppError, BadRequestError, UnauthorizedError } from "@/lib/AppError";
import { db } from "@/lib/db";
import { txns } from "@/lib/db/schema";
import { txnInsertSchema, txnUpdateSchema,txnDeleteSchema } from "@/lib/db/zod-schema";

type Txn=InferSelectModel<typeof txns>;

export async function createTxn(input: unknown) : Promise<Txn> {
  //Auth
  const session = await auth();
  if (!session?.user?.id) {
    throw new UnauthorizedError();
  }
  //Validate Client input
  const { success, data } = txnInsertSchema.safeParse(input);
  if (!success) throw new BadRequestError("Invalid Txn Insert payload");

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
     //Auth
  const session = await auth();
  if (!session?.user?.id) {
    throw new UnauthorizedError();
  }
  //Validate Client input
  const { success, data } = txnUpdateSchema.safeParse(input);
  if (!success) throw new BadRequestError("Invalid Txn Update payload");

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
     //Auth
  const session = await auth();
  if (!session?.user?.id) {
    throw new UnauthorizedError();
  }
  //Validate Client input
  const { success, data } = txnDeleteSchema.safeParse(input);
  if (!success) throw new BadRequestError("Invalid Txn delete payload");

  const id=data.id;
  const[deletedTxn]=await db.delete(txns).where(and(eq(txns.userId,session.user.id),eq(txns.id,id))).returning();

  if (!deletedTxn) throw new AppError("Txn Delete Failed", "DELETE_FAILED", 500);

  return deletedTxn;
}
