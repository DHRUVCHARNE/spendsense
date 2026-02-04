import { categoryListInputSchema } from "@/lib/category-service/category.pagination.schema";
import { createTRPCRouter } from "../init";
import {
  buildCursorWhere,
  categoriesOrderBy,
} from "@/lib/category-service/category.service";
import { categories } from "@/lib/db/schema";
import { db } from "@/lib/db";
import {z} from "zod";
import { and, inArray,eq } from "drizzle-orm";
import { protectedProcedure } from "../procedures";


export const categoryRouter = createTRPCRouter({
  list: protectedProcedure
    .input(categoryListInputSchema)
    .query(async ({ ctx, input }) => {
      const userId = ctx.userId;
      const limit = input.limit;
      const sort = input.sort;
      const direction = input.cursor?.direction ?? "next";
      const where = buildCursorWhere({
        userId: userId,
        sort: sort,
        cursor: input.cursor,
        from: input.from,
        to: input.to,
        color: input.color,
        name: input.name,
        direction: direction,
      });
      const rows = await db
        .select()
        .from(categories)
        .where(where)
        .orderBy(...categoriesOrderBy(sort, direction))
        .limit(limit + 1);

      const hasMore = rows.length > limit;
      let items = hasMore ? rows.slice(0, limit) : rows;
      const hasPrevPage = !!input.cursor || direction == "prev";
      const hasNextPage = direction == "next" ? hasMore : !!input.cursor;
      if (direction === "prev") items = items.reverse();
      const first = items.at(0);
      const last = items.at(-1);

      return {
        items,
        hasMore,
        nextCursor:
          hasNextPage && last
            ? {
                createdAt: last.createdAt,
                id: last.id,
                direction: "next" as const,
              }
            : null,
        prevCursor:
          hasPrevPage && first
            ? {
                createdAt: first.createdAt,
                id: first.id,
                direction: "prev" as const,
              }
            : null,
      };
    }),
    getByIds:protectedProcedure
    .input(z.object({ids:z.array(z.uuid())}))
    .query(async({ctx,input})=>{
      return db
      .select()
      .from(categories)
      .where(
        and(
          eq(categories.userId,ctx.userId),
          inArray(categories.id,input.ids)
        )
      )
    }),

});
