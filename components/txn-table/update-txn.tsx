"use client"
import { txnUpdateSchema } from "@/lib/db/zod-schema";
import z from "zod";
import { FieldDescription, FieldGroup, Field, FieldLabel } from "../ui/field";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { paymentMethodEnum, txnTypeEnum } from "@/lib/db/schema";
import { BanknoteX } from "lucide-react";
import { appInfo } from "../config";
import { useState, useTransition } from "react";
import { POPULAR_CURRENCIES } from "./popular-currencies";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { useCategoryStore } from "@/app/store/categories-store";
import { updateTxnAction } from "@/app/actions/actions";
import { Spinner } from "../ui/spinner";
import { toast } from "sonner";
import { api } from "@/lib/trpc/client";
import { Input } from "../ui/input";
export default function UpdateTxnForm(options: z.infer<typeof txnUpdateSchema> & {
    open: boolean;
    setOpen: (v: boolean) => void;
}) {
    const txnTypeValues = txnTypeEnum.enumValues;
    const paymentMethodValues = paymentMethodEnum.enumValues;
    const [value, setValue] = useState<[number]>([options.data.
        amountPaise ?? 200]);
    type TxnType = typeof txnTypeValues[number];
    const [txnType, setTxnType] = useState<TxnType>(options.data.txnType ?? txnTypeValues[0]);
    const categories = useCategoryStore((s) => s.categoriesArr);
    const categoryId = options.data.categoryId;
    const [category, setCategory] = useState<string | null>(categoryId ?? null);
    const [currency, setCurrency] = useState<string>(options.data.currency ?? "INR");
    type PaymentType = typeof paymentMethodValues[number];
    const [method, setMethod] = useState<PaymentType>(options.data.paymentMethod ?? paymentMethodValues[0]);
    const [description, setDescription] = useState<string>(options.data.description ?? "");
    const [isPending, startTransition] = useTransition();
    const utils = api.useUtils();
    function handleSubmit() {
        startTransition(async () => {
            const formData = new FormData();

            // REQUIRED
            formData.append("id", options.id);

            // NESTED FIELDS → data.*
            formData.append("data.amountPaise", value[0].toString());
            formData.append("data.txnType", txnType);
            formData.append("data.categoryId", category ?? "");
            formData.append("data.currency", currency);
            formData.append("data.paymentMethod", method);
            formData.append("data.description", description ?? "");

            // Debug
            console.log(Object.fromEntries(formData.entries()));

            const res = await updateTxnAction(formData);

            if (res?.ok) {
                toast.success("Transaction Updated Successfully");
                utils.txn.list.invalidate();
                options.setOpen(false);
            } else if (res?.message) {
                toast.error(res.message);
            } else {
                toast.error("Something went wrong");
            }
        });
    }

    function SubmitButton() {

        return <Button onClick={handleSubmit} disabled={isPending} variant="outline">{isPending ? <Spinner /> : "Save"}</Button>
    }

    return (
        <Dialog open={options.open} onOpenChange={options.setOpen} >

            <DialogContent className="w-full max-w-md ">
                <DialogHeader>
                    <DialogTitle><BanknoteX />Edit Transaction</DialogTitle>
                    <DialogDescription>  Make changes to your Transaction here. Click save when you&apos;re
                        done.</DialogDescription>
                </DialogHeader>
                <FieldGroup>
                    <Field>
                        <FieldLabel htmlFor="amount">Amount</FieldLabel>
                        <FieldDescription>
                            Set your amount range (
                            <span className="font-medium tabular-nums">{1}</span> -{" "}
                            <span className="font-medium tabular-nums">{appInfo.limitsPerUser.amount}</span>).
                        </FieldDescription>
                        <Input
                            type="number"
                            min={1}
                            max={appInfo.limitsPerUser.amount}
                            value={value[0]}
                            onChange={(e) => setValue([Number(e.target.value)])}
                            className="w-32 text-right tabular-nums"
                        />
                    </Field>
                    <div><Field>
                        <FieldLabel htmlFor="txnType">Transaction Type</FieldLabel>
                        <Select
                            value={txnType}
                            onValueChange={(v) => setTxnType(v as TxnType)}
                        >
                            <SelectTrigger id="txnType">
                                <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {txnTypeValues.map((type) => (
                                        <SelectItem key={type} value={type}>{type}</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </Field>
                        <Field>
                            <FieldLabel htmlFor="categoryType">Category Type</FieldLabel>
                            <Select
                                value={category ?? undefined}
                                onValueChange={(v) => setCategory(v as string)}

                            >
                                <SelectTrigger id="categoryType">
                                    <SelectValue placeholder="Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {categories.map((type) => (
                                            <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="currency">Currency</FieldLabel>
                            <Select
                                value={currency}
                                onValueChange={(v) => setCurrency(v as string)}
                            >
                                <SelectTrigger id="currency">
                                    <SelectValue placeholder="Currency" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {POPULAR_CURRENCIES.map((type) => (
                                            <SelectItem key={type.code} value={type.code}><HoverCard openDelay={10} closeDelay={50}>
                                                <HoverCardTrigger asChild><span className="flex items-center justify-center gap-2 cursor-pointer">
                                                    <span>{type.symbol}</span>
                                                    <span className="text-muted-foreground text-xs">{type.code}

                                                    </span>
                                                </span></HoverCardTrigger>
                                                <HoverCardContent className="w-64 text-md leading-relaxed">
                                                    {type.name}
                                                </HoverCardContent>
                                            </HoverCard></SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </Field>
                    </div>
                    <Field>
                        <FieldLabel htmlFor="description">Description</FieldLabel>
                        <Textarea id="description" placeholder="Had a Cup of Coffee"
                            value={description}
                            onChange={(v) => setDescription(v.target.value)}
                            name="description"
                        />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="paymentMethod">Payment Method</FieldLabel>
                        <Select
                            value={method}
                            onValueChange={(v) => setMethod(v as PaymentType)}
                        >
                            <SelectTrigger id="paymentMethod">
                                <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {paymentMethodValues.map((type) => (
                                        <SelectItem key={type} value={type}>{type}</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </Field></FieldGroup>
                <DialogFooter>
                    <div className="py-3 flex gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => options.setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <SubmitButton /></div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}