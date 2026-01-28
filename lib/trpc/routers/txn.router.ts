import { txnListInputSchema } from "@/lib/txn-service/txn.pagination.schema";
import { createTRPCRouter, protectedProcedure } from "../init";
import { buildCursorWhere, txnOrderBy } from "@/lib/txn-service/txn.service";
import { db } from "@/lib/db";
import { txns } from "@/lib/db/schema";


export const txnRouter = createTRPCRouter({
    list:protectedProcedure
    .input(txnListInputSchema)
    .query(async({ctx,input})=>{
        const userId = ctx.userId;
        const limit=input.limit;
        const sort =input.sort;
        const direction=input.cursor?.direction ?? "next";
        const where=buildCursorWhere({
            userId:userId,
            sort:sort,
            cursor:input.cursor,
            from:input.from,
            to:input.to,
            txnType:input.txnType,
            categoryId:input.categoryId,
            paymentMethod:input.paymentMethod,
            direction:direction
        });
        const rows= await db
        .select()
        .from(txns)
        .where(where)
        .orderBy(...txnOrderBy(sort,direction))
        .limit(limit+1);

        const hasMore = rows.length > limit;
        let items = hasMore ? rows.slice(0,limit):rows;
        if(direction==="prev") items=items.reverse();
        const first=items.at(0);
        const last=items.at(-1);

        return {
            items,
            hasMore,
            nextCursor:hasMore && last ? {createdAt:last.createdAt,id:last.id,direction:"next" as const}:null,
            prevCursor: hasMore && first ? {createdAt:first.createdAt,id:first.id,direction:"prev" as const}:null
        }
    })
})