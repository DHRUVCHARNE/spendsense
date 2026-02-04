import { TRPCError } from "@trpc/server";
import { fetchLimiter } from "../../rate-limit/rate-limit";
import { t } from "../init";
import { Session } from "next-auth";
import { Context } from "../init";
export const ipRateLimit = t.middleware(async ({ ctx, next }) => {
  const { success } = await fetchLimiter.limit(`ip:${ctx.ip}`);
  if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
  return next();
});
type AuthedContext = Context & {
  session: Session;
  userId: string;
};
export const userRateLimit = t.middleware<{ctx:AuthedContext}>(async (opts) => {
  // Use type assertion since we know this runs 
  const ctxWithUserId = opts.ctx as typeof opts.ctx & { userId?: string };
  const userId = ctxWithUserId.userId;
  
  if (!userId) {
    console.error("userRateLimit called without userId in context");
    throw new TRPCError({ 
      code: "INTERNAL_SERVER_ERROR",
      message: "Rate limiting configuration error" 
    });
  }
  
  const { success } = await fetchLimiter.limit(`user:${userId}`);
  if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
  
  return opts.next();
});