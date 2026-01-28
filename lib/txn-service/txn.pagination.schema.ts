import { paymentMethodEnum, txnTypeEnum } from "@/lib/db/schema";
import {z} from "zod";


export const txnCursorDirectionSchema=z.enum(["next","prev"]);
export const txnSortSchema = z.enum(["asc","desc"]);
export const txnCursorSchema = z.object({
    createdAt:z.date(),
    id:z.uuid(),
    direction:txnCursorDirectionSchema.optional()
});

export const txnListInputSchema = z.object({
    limit:z.number().int().min(5).max(20).default(10),
    sort: txnSortSchema.default("desc"),
    cursor:txnCursorSchema.optional(),
    //Optional Filters
    from: z.date().optional(),
    to:z.date().optional(),
    txnType:z.enum(txnTypeEnum.enumValues).optional(),
    categoryId:z.uuid().nullish(),
    paymentMethod: z.enum(paymentMethodEnum.enumValues).optional(),

}).refine((val)=>{
    if(val.from && val.to) return val.from <= val.to;
    return true;
},{error:`"from" must be <= "to"`})