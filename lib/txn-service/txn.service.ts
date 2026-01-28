import { PaymentMethodType, txns, TxnType } from "@/lib/db/schema";
import { and, eq, gte, isNull, lte,gt,or ,lt, asc, desc} from "drizzle-orm";

type Cursor = { createdAt: Date; id: string };

type buildCursorWhereParams = {
  userId: string;
  direction:"next" | "prev";
  sort: "asc" | "desc";
  cursor?: Cursor;
  from?: Date;
  to?: Date;
  txnType?: TxnType;
  categoryId?: string | null;
  paymentMethod?: PaymentMethodType;
};

type cursorClauseParams = {
  sort:"asc" | "desc";
  direction: "next" | "prev";
  cursor:Cursor
}

function isDefined<T>(v:T | undefined): v is T {
  return v!==undefined;
}

function cursorClause(params:cursorClauseParams){
  const {sort,direction,cursor}=params;
  const goingForward = direction ==="next";
  //If sort is asc,forward means "greater" and backwards means "less"
  //If sort is desc,forward means "less" and backwards means "greater"
  const useGreater =(sort ==="asc") ===goingForward;

  return useGreater ?
  or(
    gt(txns.createdAt,cursor.createdAt),
    and(
      eq(txns.createdAt,cursor.createdAt),
      gt(txns.id,cursor.id)
    )
  ):
  or(
    lt(txns.createdAt,cursor.createdAt),
    and(
      eq(txns.createdAt,cursor.createdAt),
      lt(txns.id,cursor.id)
    )
  );
}

export function buildCursorWhere(params: buildCursorWhereParams) {
  const { userId, sort,direction, cursor, from, to, txnType, categoryId, paymentMethod } =
    params;

  const base = [
    eq(txns.userId, userId),
    from ? gte(txns.createdAt, from) : undefined,
    to ? lte(txns.createdAt, to) : undefined,
    txnType ? eq(txns.txnType, txnType) : undefined,
    categoryId!==undefined ? categoryId===null ? isNull(txns.categoryId):eq(txns.categoryId,categoryId):undefined,
    paymentMethod !==undefined? eq(txns.paymentMethod,paymentMethod):undefined,
    cursor? cursorClause({sort,direction,cursor}):undefined,
  ].filter(isDefined);


  return and(...base);
  
}

export function txnOrderBy(sort:"asc" | "desc", direction:"next" | "prev"){
  const normal = sort==="asc"?
  [asc(txns.createdAt),asc(txns.id)]:[desc(txns.createdAt),desc(txns.id)];
  // When going prev, reverse order for correct "previous page" selection
  const reversed = sort==="asc"?
  [desc(txns.createdAt),desc(txns.id)]:
  [asc(txns.createdAt),asc(txns.id)];
  return direction === "next" ? normal : reversed;
}