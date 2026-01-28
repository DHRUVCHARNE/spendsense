import { createTRPCRouter } from "../init";
import { txnRouter } from "./txn.router";


export const appRouter = createTRPCRouter({
    txn:txnRouter,
});

export type AppRouter = typeof appRouter;