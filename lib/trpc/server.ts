import { cache } from "react"
import "server-only"
import { makeQueryClient } from "./query-client"
import { createCallerFactory, createTRPCContext } from "./init";
import { appRouter } from "./routers/_app";

export const getQueryClient=cache(makeQueryClient);
const caller = createCallerFactory(appRouter)(createTRPCContext);

export {caller}; //Now I can call await caller.txn.list(input) on the server