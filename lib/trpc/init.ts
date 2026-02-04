import {initTRPC, TRPCError} from "@trpc/server";
import superjson from "superjson";
import { headers } from "next/headers";
export const createTRPCContext = (async()=>{
    const h = headers();
    const ip = 
    (await h).get("x-forwarded-for")?.split(",")[0] ??
    (await h).get("x-real-ip") ??
    "unknown";
    return {
        ip
    };
});
export type Context = {
  ip: string;
  session?:any;
  
};
export const t =initTRPC.context<Context>().create({
    transformer:superjson,
});
export const createTRPCRouter=t.router;
export const publicProcedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;
