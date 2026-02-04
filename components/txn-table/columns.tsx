import { txnSelectSchema } from "@/lib/db/zod-schema";
import z from "zod";
import { ColumnDef } from "@tanstack/react-table"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";
import { Button } from "../ui/button";
import { useCategoryStore } from "@/app/store/categories-store";
import ActionsCell from "./action-cell";
import { CURRENCY_MAP } from "./popular-currencies";
import { Field, FieldLabel } from "../ui/field";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "../ui/select";
import { txnTypeValues, paymentMethodValues } from "./update-txn";
import { BaseInput } from "@/lib/txn-service/hooks/useTxns";
import { TxnDateRangeFilter } from "./txn-date-range-filter";
export type Txn = z.infer<typeof txnSelectSchema>;

function truncateChars(text: string, limit: number) {
    return text.length > limit ? text.slice(0, limit) + "..." : text;
}

function CategoryHeaderFilter({
    value,
    onChange,
}: {
    value?: string;
    onChange: (v?: string) => void;
}) {
    const categories = useCategoryStore((s) => s.categoriesArr);

    return (
        <Field>
            <FieldLabel htmlFor="categoryType">Category Type</FieldLabel>
            <Select
                value={value ?? "ALL"}
                onValueChange={(v) => onChange(v === "ALL" ? undefined : v)}
            >
                <SelectTrigger id="categoryType">
                    <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectItem value="ALL">All</SelectItem>
                        {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                                {cat.name}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </Field>
    );
}


export const getTxnColumns = (
    filters: BaseInput,
    setFilters: React.Dispatch<React.SetStateAction<BaseInput>>
): ColumnDef<Txn>[] => [
        {
            accessorKey: "txnType",
            header: () => (
                <Field>
                    <FieldLabel htmlFor="txnType">Transaction Type</FieldLabel>
                    <Select
                        value={filters.txnType ?? ""}
                        onValueChange={(v) =>
                            setFilters(f => ({
                                ...f,
                                txnType: v === "ALL" ? undefined : (v as BaseInput["txnType"]),
                            }))
                        }
                    >
                        <SelectTrigger id="txnType" className="h-8 text-xs">
                            <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="ALL">All</SelectItem>
                                {txnTypeValues.map((type) => (
                                    <SelectItem key={type} value={type}>{type}</SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </Field>)
        },
        {
            accessorKey: "categoryId",
            header: () => (
                <CategoryHeaderFilter
                    value={filters.categoryId ?? undefined}
                    onChange={(v) =>
                        setFilters(f => ({
                            ...f,
                            categoryId: v,
                        }))
                    }
                />
            ),
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
            header: () => (
                <TxnDateRangeFilter
                    from={filters.from}
                    to={filters.to}
                    setFilters={setFilters}
                />
            ),
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
            header: () => (
                <Field>
                    <FieldLabel htmlFor="paymentMethod">Method</FieldLabel>
                    <Select
                        value={filters.paymentMethod ?? "ALL"}
                        onValueChange={(v) =>
                            setFilters(f => ({
                                ...f,
                                paymentMethod: v === "ALL"
                                    ? undefined
                                    : (v as BaseInput["paymentMethod"]),
                            }))
                        }
                    >
                        <SelectTrigger id="paymentMethod" className="h-8 text-xs">
                            <SelectValue placeholder="Method" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="ALL">All</SelectItem>
                                {paymentMethodValues.map((m) => (
                                    <SelectItem key={m} value={m}>{m}</SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </Field>
            ),
        },
        {
            id: "actions",
            cell: ({ row }) => <ActionsCell txn={row.original} />
        }
    ]