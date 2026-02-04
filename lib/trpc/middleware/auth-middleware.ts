import { auth } from "@/auth";
import { t } from "../init";
import { TRPCError } from "@trpc/server";

export const authMiddleware = t.middleware(async ({ctx,next})=>{
    const session = await auth();
    if(!session?.user?.id) {
        throw new TRPCError({code:"UNAUTHORIZED"});
    }
    return next({
        ctx:{
            ...ctx,
            session:ctx.session,
            userId:session.user.id
        }
    });
})