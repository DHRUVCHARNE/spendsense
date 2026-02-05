import { txnListInputSchema } from "@/lib/txn-service/txn.pagination.schema";
import { createTRPCRouter } from "../init";
import {
  buildCursorWhere,
  isDefined,
  txnOrderBy,
} from "@/lib/txn-service/txn.service";
import { db } from "@/lib/db";
import { txns } from "@/lib/db/schema";
import z from "zod";
import { and, eq, sql,desc, gte, ilike, lte } from "drizzle-orm";
import { protectedProcedure } from "../procedures";
function asRows<T>(r: unknown): T[] {
  return r as T[];
}
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
      const res = await db.execute(sql`
    SELECT
      currency,
      SUM(amount_paise) FILTER (WHERE txn_type='INCOME') AS income,
      SUM(amount_paise) FILTER (WHERE txn_type='EXPENSE') AS expense
    FROM txn
    WHERE user_id = ${ctx.userId}
    GROUP BY currency
  `);

      const rows = asRows<{
        currency: string;
        income: number | null;
        expense: number | null;
      }>(res);

      return rows.map((r) => ({
        currency: r.currency,
        income: Number(r.income ?? 0) / 100,
        expense: Number(r.expense ?? 0) / 100,
      }));
    }),
  monthlyStats: protectedProcedure.query(async ({ ctx }) => {
    const res = await db.execute(sql`
    SELECT
      to_char(date_trunc('month', created_at), 'YYYY-MM') AS month,
      currency,
      SUM(amount_paise) FILTER (WHERE txn_type='EXPENSE') AS expenses,
      SUM(amount_paise) FILTER (WHERE txn_type='INCOME') AS income
    FROM txn
    WHERE user_id = ${ctx.userId}
    GROUP BY date_trunc('month', created_at), currency
    ORDER BY date_trunc('month', created_at) ASC
  `);

    const rows = asRows<{
      month: string;
      currency: string;
      expenses: number | null;
      income: number | null;
    }>(res);

    return rows.map((r) => ({
      month: r.month,
      currency: r.currency,
      expenses: Number(r.expenses ?? 0) / 100,
      income: Number(r.income ?? 0) / 100,
    }));
  }),
  categoryBreakdown: protectedProcedure
    .input(
      z.object({
        from: z.date().optional(),
        to: z.date().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const res = await db.execute(sql`
    SELECT c.name, c.color,
           SUM(t.amount_paise) AS total
    FROM txn t
    JOIN category c ON c.id = t.category_id
    WHERE t.user_id = ${ctx.userId}
      AND t.txn_type = 'EXPENSE'
    GROUP BY c.id
    ORDER BY total DESC
  `);

      const rows = asRows<{
        name: string;
        color: string;
        total: number | null;
      }>(res);

      return rows.map((r) => ({
        name: r.name,
        value: Number(r.total ?? 0) / 100,
        fill: r.color,
      }));
    }),
  paymentMethodBreakdown: protectedProcedure.query(async ({ ctx }) => {
    const res = await db.execute(sql`
    SELECT payment_method, SUM(amount_paise) AS total
    FROM txn
    WHERE user_id = ${ctx.userId}
    GROUP BY payment_method
    ORDER BY total DESC
  `);

    const rows = asRows<{
      payment_method: string;
      total: number | null;
    }>(res);

    return rows.map((r) => ({
      method: r.payment_method,
      total: Number(r.total ?? 0) / 100,
    }));
  }),
  reportDashboard: protectedProcedure
    .input(
      z.object({
        from: z.date().optional(),
        to: z.date().optional(),
        currency: z.string().default("INR"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { from, to, currency } = input;
      try {
        const filters = [
          eq(txns.userId, ctx.userId),
          eq(txns.currency, currency),
          from ? gte(txns.createdAt, from) : undefined,
          to ? lte(txns.createdAt, to) : undefined,
        ].filter(isDefined); // Removes allvalues undefined
        const baseWhere = and(...filters);
        const summaryRes = await db.execute(sql`
        SELECT
          SUM(amount_paise) FILTER (WHERE txn_type='INCOME') AS income,
          SUM(amount_paise) FILTER (WHERE txn_type='EXPENSE') AS expense
        FROM txn
        WHERE ${baseWhere}
      `);

        const dailyRes = await db.execute(sql`
  SELECT
    DATE(created_at) as day,
    SUM(amount_paise) FILTER (WHERE txn_type='INCOME') as income,
    SUM(amount_paise) FILTER (WHERE txn_type='EXPENSE') as expenses
  FROM txn
  WHERE ${baseWhere}
  GROUP BY DATE(created_at)
  ORDER BY DATE(created_at)
`);

        const categoryRes = await db.execute(sql`
        SELECT c.name, c.color, SUM(txn.amount_paise) AS total
        FROM txn
        JOIN category c ON c.id = txn.category_id
        WHERE ${baseWhere} AND txn.txn_type='EXPENSE'
        GROUP BY c.id, c.name, c.color
        ORDER BY total DESC
      `);

        const paymentRes = await db.execute(sql`
        SELECT payment_method, SUM(amount_paise) AS total
        FROM txn
        WHERE ${baseWhere}
        GROUP BY payment_method
        ORDER BY total DESC
      `);

        const summaryRows = asRows<{
          income: number | null;
          expense: number | null;
        }>(summaryRes);
        const categoryRows = asRows<{
          name: string;
          color: string;
          total: number | null;
        }>(categoryRes);
        const paymentRows = asRows<{
          payment_method: string;
          total: number | null;
        }>(paymentRes);
        const dailyRows = asRows<{
          day: string;
          income: number | null;
          expenses: number | null;
        }>(dailyRes);

        let runningBalance = 0;

        const dailyTrend = dailyRows.map((r) => {
          const income = Number(r.income ?? 0);
          const expenses = Number(r.expenses ?? 0);

          runningBalance += income - expenses;

          return {
            date: r.day, // "2026-02-05"
            income,
            expenses,
            balance: runningBalance, // cumulative
          };
        });
        const payload = {
          summary: {
            income: Number(summaryRows[0]?.income ?? 0),
            expense: Number(summaryRows[0]?.expense ?? 0),
          },
          trend: dailyTrend,
          categories: categoryRows.map((r) => ({
            name: r.name,
            value: Number(r.total ?? 0),
            fill: r.color,
          })),
          payments: paymentRows.map((r) => ({
            method: r.payment_method,
            total: Number(r.total ?? 0),
          })),
        };
        console.log(payload);
        return payload;
      } catch (err) {
        console.error(err);
        return {
          summary: { income: 0, expense: 0 },
          trend: [], 
          categories: [],
          payments: [],
        };
      }
    }),
  search: protectedProcedure
  .input(z.object({ q: z.string().min(1).max(50) }))
  .query(async ({ ctx, input }) => {
    const q = input.q.trim()

    if (!q) return []

    return db
      .select()
      .from(txns)
      .where(
        and(
          eq(txns.userId, ctx.userId),
          ilike(txns.description, `%${q}%`)
        )
      )
      .orderBy(desc(txns.createdAt))
      .limit(10)
  })
});
