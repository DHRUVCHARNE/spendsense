import { txnSelectSchema } from "@/lib/db/zod-schema";
import z from "zod";
import { ColumnDef } from "@tanstack/react-table"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";
import { Button } from "../ui/button";
import { useCategoryStore } from "@/app/store/categories-store";
import ActionsCell from "./action-cell";
import { CURRENCY_MAP } from "./popular-currencies";

export type Txn = z.infer<typeof txnSelectSchema>;

function truncateChars(text: string, limit: number) {
    return text.length > limit ? text.slice(0, limit) + "..." : text;
}


export const columns: ColumnDef<Txn>[] = [
    {
        accessorKey: "txnType",
        header: "Type"
    },
    {
        accessorKey: "categoryId",
        header: "Category",
        cell: ({ row }) => {
            const categories = useCategoryStore((s) => s.categories);
            const categoryId = row.original.categoryId;
            if (!categoryId) {
                return <Button variant="ghost">N/A</Button>
            }
            const category = categoryId ? categories[categoryId] : null;
            return (
                <span className="inline-flex items-center gap-2 rounded-full bg-muted px-2 py-0.5 text-xs font-medium max-w-35">
                    {category?.color && (
                        <span
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: category.color }}
                        />
                    )}
                    <span className=" truncate text-muted-foreground">
                        {(category?.name ?? "Unknown").slice(0, 12)}
                    </span>
                </span>
            )
        }
    },
    {
        accessorKey: "amountPaise",
        header: () => <div className="text-right">Amount</div>,
        cell: ({ row }) => {
            const isExpense = row.original.txnType === "EXPENSE";
            const amount = row.original.amountPaise;
            const currencyCode = row.original.currency;
            const currency = CURRENCY_MAP[currencyCode]?.code ?? "INR";
            const symbol = CURRENCY_MAP[currencyCode]?.symbol ?? "";
            const formatted = `${symbol}${amount.toLocaleString("en-IN")}`;
            return (
                <div
                    className={`text-right font-semibold ${isExpense ? "text-red-600" : "text-emerald-600"
                        }`}
                >
                    {formatted}
                </div>
            );
        }
    },
    {
        accessorKey: "createdAt",
        header: "Date",
        cell: ({ row }) => {
            const date = new Date(row.original.createdAt);
            return date.toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric"
            });
        }
    },
    {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => {
            const full = row.original.description;
            const short = full ? truncateChars(full, 21) : "";
            return (
                <HoverCard openDelay={10} closeDelay={50}>
                    <HoverCardTrigger asChild><Button variant="link" className="h-auto p-0 text-left font-normal">{short}</Button></HoverCardTrigger>
                    <HoverCardContent className="w-72 text-sm leading-relaxed">
                        {full}
                    </HoverCardContent>
                </HoverCard>
            )
        }
    },
    {
        accessorKey: "paymentMethod",
        header: "Method",
    },
    {
        id: "actions",
        cell: ({ row }) => <ActionsCell txn={row.original} />
    }
]