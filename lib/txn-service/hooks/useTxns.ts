import z from "zod";
import { txnListInputSchema } from "../txn.pagination.schema";
import { api } from "@/lib/trpc/client";

type TxnInput = z.infer<typeof txnListInputSchema>;
export type BaseInput = Partial<Omit<TxnInput, "cursor">>;

export function useTxns(options?: BaseInput) {
  const query = api.txn.list.useInfiniteQuery(
    {
      ...options,
    },
    {
      getNextPageParam: (lastPage) => {
        return lastPage.nextCursor ?? undefined;
      },
      getPreviousPageParam: (firstPage) => {
        return firstPage.prevCursor ?? undefined;
      },
    },
  );
  const items = query.data?.pages.flatMap((p) => p.items) ?? [];
  return Object.assign(query, { items });
}
