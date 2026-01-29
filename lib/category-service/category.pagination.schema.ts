import { paymentMethodEnum, txnTypeEnum } from "@/lib/db/schema";
import {z} from "zod";


export const categoryCursorDirectionSchema=z.enum(["next","prev"]);
export const categorySortSchema = z.enum(["asc","desc"]);
export const categoryCursorSchema = z.object({
    createdAt:z.date(),
    id:z.uuid(),
    direction:categoryCursorDirectionSchema.optional()
});

export const categoryListInputSchema = z.object({
    limit:z.number().int().min(5).max(20).default(10),
    sort: categorySortSchema.default("desc"),
    cursor:categoryCursorSchema.optional(),
    //Optional Filters
    from: z.date().optional(),
    to:z.date().optional(),
    name:z.string().optional(),
    color:z.string().optional()
}).refine((val)=>{
    if(val.from && val.to) return val.from <= val.to;
    return true;
},{error:`"from" must be <= "to"`})