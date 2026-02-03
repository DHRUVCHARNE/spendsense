import { createTRPCRouter } from "../init";
import { categoryRouter } from "./category.router";
import { txnRouter } from "./txn.router";
import { inferRouterOutputs } from "@trpc/server";



export const appRouter = createTRPCRouter({
    txn:txnRouter,
    category:categoryRouter
});

export type AppRouter = typeof appRouter;
export type RouterOutputs = inferRouterOutputs<AppRouter>;