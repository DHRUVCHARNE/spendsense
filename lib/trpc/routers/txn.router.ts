import { txnListInputSchema } from "@/lib/txn-service/txn.pagination.schema";
import { createTRPCRouter, protectedProcedure } from "../init";
import { buildCursorWhere, txnOrderBy } from "@/lib/txn-service/txn.service";
import { db } from "@/lib/db";
import { txns } from "@/lib/db/schema";
import z from "zod";
import { and, eq, sql, lte, gte,ilike} from "drizzle-orm";

export const txnRouter = createTRPCRouter({
  list: protectedProcedure
    .input(txnListInputSchema)
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
        txnType: input.txnType,
        categoryId: input.categoryId,
        paymentMethod: input.paymentMethod,
        direction: direction,
      });
      const rows = await db
        .select()
        .from(txns)
        .where(where)
        .orderBy(...txnOrderBy(sort, direction))
        .limit(limit + 1);

      const hasMore = rows.length > limit;
      let items = hasMore ? rows.slice(0, limit) : rows;
      if (direction === "prev") items = items.reverse();
      const first = items.at(0);
      const last = items.at(-1);
      const hasPrevPage = !!input.cursor || direction == "prev";
      const hasNextPage = direction == "next" ? hasMore : !!input.cursor;
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
  getById: protectedProcedure
    .input(z.object({ id: z.uuid() }))
    .query(async ({ ctx, input }) => {
      return db.query.txns.findFirst({
        where: and(eq(txns.id, input.id), eq(txns.userId, ctx.userId)),
      });
    }),
  summary: protectedProcedure
    .input(
      z.object({
        from: z.date().optional(),
        to: z.date().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return db
        .select({
          income: sql<number>`sum(case when ${txns.txnType}='INCOME' then ${txns.amountPaise} else 0 end)`,
          expense: sql<number>`sum(case when ${txns.txnType}='EXPENSE' then ${txns.amountPaise} else 0 end)`,
        })
        .from(txns)
        .where(
          and(
            eq(txns.userId, ctx.userId),
            input.from ? gte(txns.createdAt, input.from) : undefined,
            input.to ? lte(txns.createdAt, input.to) : undefined,
          ),
        );
    }),
  monthlyStats: protectedProcedure.query(async ({ ctx }) => {
    return db.execute(sql`
      SELECT
        date_trunc('month', created_at) as month,
        SUM(amount_paise) FILTER (WHERE txn_type='EXPENSE') as expenses,
        SUM(amount_paise) FILTER (WHERE txn_type='INCOME') as income
      FROM txns
      WHERE user_id = ${ctx.userId}
      GROUP BY month
      ORDER BY month ASC
    `);
  }),
  categoryBreakdown: protectedProcedure
    .input(
      z.object({
        from: z.date().optional(),
        to: z.date().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return db.execute(sql`
      SELECT c.id, c.name, c.color,
             SUM(t.amount_paise) as total
      FROM txns t
      JOIN categories c ON c.id = t.category_id
      WHERE t.user_id = ${ctx.userId}
        AND t.txn_type = 'EXPENSE'
      GROUP BY c.id
      ORDER BY total DESC
    `);
    }),
  paymentMethodBreakdown: protectedProcedure.query(async ({ ctx }) => {
    return db.execute(sql`
    SELECT payment_method, SUM(amount_paise) as total
    FROM txns
    WHERE user_id = ${ctx.userId}
    GROUP BY payment_method
    ORDER BY total DESC
  `);
  }),
  search: protectedProcedure
    .input(z.object({ q: z.string() }))
    .query(async ({ ctx, input }) => {
      return db
        .select()
        .from(txns)
        .where(
          and(
            eq(txns.userId, ctx.userId),
            ilike(txns.description, `%${input.q}%`),
          ),
        )
        .limit(20);
    }),
});
