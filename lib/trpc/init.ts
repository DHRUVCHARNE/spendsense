import {initTRPC, TRPCError} from "@trpc/server";
import superjson from "superjson";
import {cache} from "react";
import { auth } from "@/auth";

export const createTRPCContext = cache(async()=>{
    const session=await auth();
    return {
        userId:session?.user?.id ?? null,
    };
});

const t =initTRPC.context<typeof createTRPCContext>().create({
    transformer:superjson,
});
export const createTRPCRouter=t.router;
export const protectedProcedure = t.procedure.use(({ctx,next})=>{
    if(!ctx.userId) throw new TRPCError({code:"UNAUTHORIZED"});
    return next({ctx:{...ctx,userId:ctx.userId}});
});
export const createCallerFactory = t.createCallerFactory;
