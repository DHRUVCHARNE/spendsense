import { auth } from "@/auth";
import {
  UnauthorizedError,
  BadRequestError,
  NotFoundError,
} from "@/lib/AppError";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { userDeleteSchema } from "@/lib/db/zod-schema";
import { or, eq } from "drizzle-orm";
import { Guard } from "./action-helper";
import { deleteLimiter } from "@/lib/rate-limit/rate-limit";
//Account Deletion
export async function deleteUser(input: unknown): Promise<void> {
  const session = await Guard(deleteLimiter,{
      errorMessage:"Too many Requests",
      requireAuth:true
    });

  //Validate Client input
  const { success, data } = userDeleteSchema.safeParse(input);
  if (!success) throw new BadRequestError("Invalid User delete payload");

  const targetUserId = data.id;

  
  // ✅ Get current user role from DB
  const currentUser = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
    columns: { id: true, role: true },
  });

  if(!currentUser) throw new UnauthorizedError();

  //Permission Check
  const isAdmin=currentUser.role === "ADMIN";
  const isSelf=session.user.id === targetUserId;

  if(!isAdmin && !isSelf) throw new UnauthorizedError("You are not allowed to delete this user");

    //Fetch Target user
  const targetUser = await db.query.users.findFirst({
    where: eq(users.id, targetUserId),
  });

  if (!targetUser) throw new NotFoundError("User Not Found");

  //Prevent Deleting Admin Accounts

  if (targetUser.role == "ADMIN")
    throw new BadRequestError("Admin Account can't be deleted");

  await db.delete(users).where(eq(users.id,targetUserId));
}
