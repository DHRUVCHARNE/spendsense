"use server"

import { auth } from "@/auth";
import { BadRequestError, UnauthorizedError,AppError } from "@/lib/AppError";
import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema"
import { createCategorySchema, updateCategorySchema,deleteCategorySchema} from "@/lib/db/zod-schema";
import { InferSelectModel,and,eq, sql } from "drizzle-orm"
import { appInfo } from "@/components/config";

type Category = InferSelectModel<typeof categories>;

export async function createCategory(input:unknown):Promise<Category>{
    //Auth 
    const session = await auth();
    if(!session?.user?.id) throw new UnauthorizedError();
    //Validate client input
    const {success,data}=createCategorySchema.safeParse(input);
    if(!success) throw new BadRequestError("Invalid Category Insert Payload");

    // 🔒 Count user's Categories
  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(categories)
    .where(eq(categories.userId, session.user.id))

  const count = Number(result[0].count)

  if (count >= appInfo.limitsPerUser.categories) {
    throw new AppError(
      `Category limit reached (${appInfo.limitsPerUser.categories} max). Upgrade plan or delete old ones.`,
      "CATEGORY_LIMIT_REACHED",
      400
    )
  }

    //Insert Category
    const [createdCategory]=await db.insert(categories).values({
        ...data,userId:session.user.id
    }).returning();

    if (!createdCategory) throw new AppError("Insert Category Failed", "INSERT_FAILED", 500);

    return createdCategory;
}

export async function updateCategory(input:unknown):Promise<Category>{
    //Auth 
    const session = await auth();
    if(!session?.user?.id) throw new UnauthorizedError();
    //Validate client input
    const {success,data}=updateCategorySchema.safeParse(input);
    if(!success) throw new BadRequestError("Invalid Category Insert Payload");
    //Parse
     const {id,data:payload}=data;
    //Update
    const[updatedCategory]=await db.update(categories).set({...payload}).where(and(
        eq(categories.id,id),
        eq(categories.userId,session.user.id)
    )).returning();
    
    if(!updatedCategory) throw new AppError("Category Update Failed", "UPDATE_FAILED", 500);

    return updatedCategory;
}
export async function deleteCategory(input:unknown):Promise<Category>{
       //Auth
      const session = await auth();
      if (!session?.user?.id) {
        throw new UnauthorizedError();
      }
      //Validate Client input
      const { success, data } = deleteCategorySchema.safeParse(input);
      if (!success) throw new BadRequestError("Invalid Category delete payload");
    
      const id=data.id;
      const[deletedCategory]=await db.delete(categories).where(and(eq(categories.userId,session.user.id),eq(categories.id,id))).returning();
    
      if (!deletedCategory) throw new AppError("Category Delete Failed", "DELETE_FAILED", 500);
    
      return deletedCategory;
}

