import { categories } from "@/lib/db/schema";
import { and, eq, gte, isNull, lte, gt, or, lt, asc, desc, ilike } from "drizzle-orm";

type Cursor = { createdAt: Date; id: string };

type buildCursorWhereParams = {
  userId: string;
  direction: "next" | "prev";
  sort: "asc" | "desc";
  cursor?: Cursor;
  from?: Date;
  to?: Date;
  name?: string;
  color?: string;
};

type cursorClauseParams = {
  sort: "asc" | "desc";
  direction: "next" | "prev";
  cursor: Cursor;
};

function isDefined<T>(v: T | undefined): v is T {
  return v !== undefined;
}

function cursorClause(params: cursorClauseParams) {
  const { sort, direction, cursor } = params;
  const goingForward = direction === "next";
  //If sort is asc,forward means "greater" and backwards means "less"
  //If sort is desc,forward means "less" and backwards means "greater"
  const useGreater = (sort === "asc") === goingForward;

  return useGreater
    ? or(
        gt(categories.createdAt, cursor.createdAt),
        and(
          eq(categories.createdAt, cursor.createdAt),
          gt(categories.id, cursor.id),
        ),
      )
    : or(
        lt(categories.createdAt, cursor.createdAt),
        and(
          eq(categories.createdAt, cursor.createdAt),
          lt(categories.id, cursor.id),
        ),
      );
}

export function buildCursorWhere(params: buildCursorWhereParams) {
  const { userId, sort, direction, cursor, from, to, name, color } = params;

  const base = [
    eq(categories.userId, userId),
    from ? gte(categories.createdAt, from) : undefined,
    to ? lte(categories.createdAt, to) : undefined,
    color ? eq(categories.color, color) : undefined,
    name !== undefined
      ? ilike(categories.name, `%${name}%`)
      : undefined,
    cursor ? cursorClause({ sort, direction, cursor }) : undefined,
  ].filter(isDefined);

  return and(...base);
}

export function categoriesOrderBy(sort: "asc" | "desc", direction: "next" | "prev") {
  const normal =
    sort === "asc"
      ? [asc(categories.createdAt), asc(categories.id)]
      : [desc(categories.createdAt), desc(categories.id)];
  // When going prev, reverse order for correct "previous page" selection
  const reversed =
    sort === "asc"
      ? [desc(categories.createdAt), desc(categories.id)]
      : [asc(categories.createdAt), asc(categories.id)];
  return direction === "next" ? normal : reversed;
}
