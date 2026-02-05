import { FieldDescription, FieldGroup, Field, FieldLabel } from "../ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { paymentMethodEnum, txnTypeEnum } from "@/lib/db/schema";
import { BanknoteX } from "lucide-react";
import { appInfo } from "../config";
import { Input } from "../ui/input";
import { useState, useTransition } from "react";
import { POPULAR_CURRENCIES } from "./popular-currencies";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { useCategoryStore } from "@/app/store/categories-store";
import { createTxnAction } from "@/app/actions/actions";
import { Spinner } from "../ui/spinner";
import { toast } from "sonner";
import { api } from "@/lib/trpc/client";
export default function CreateTxnForm({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  const txnTypeValues = txnTypeEnum.enumValues;
  const paymentMethodValues = paymentMethodEnum.enumValues;
  const categories = useCategoryStore((s) => s.categoriesArr);

  const [value, setValue] = useState<[number]>([200]);
  type TxnType = typeof txnTypeValues[number];
  const [txnType, setTxnType] = useState<TxnType>(txnTypeValues[0]);
  const [category, setCategory] = useState<string | null>(null);
  const [currency, setCurrency] = useState<string>("INR");
  type PaymentType = typeof paymentMethodValues[number];
  const [method, setMethod] = useState<PaymentType>(paymentMethodValues[0]);
  const [description, setDescription] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const utils = api.useUtils();
  function handleSubmit() {
    startTransition(async () => {
      const formData= new FormData();
      formData.append("amountPaise", value[0].toString());
      formData.append("txnType", txnType);
      formData.append("categoryId", category ?? "");
      formData.append("currency", currency);
      formData.append("paymentMethod", method);
      formData.append("description", description);
      console.log(Object.values(formData));
      const res = await createTxnAction(formData)
      if (res?.ok) {
        toast.success("Transaction Updated Successfully");
        utils.txn.list.invalidate();
        setOpen(false)
      } else if (res?.message) {
        toast.error(res.message)
      } else {
        toast.error("Something went wrong")
      }
    })
  }

  function SubmitButton() {

    return <Button onClick={handleSubmit} disabled={isPending} variant="outline">{isPending ? <Spinner /> : "Save"}</Button>
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button">
          <BanknoteX className="mr-2 h-4 w-4" />
          Add Transaction
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
          <DialogDescription>
            Record a new expense or income.
          </DialogDescription>
        </DialogHeader>

        <FieldGroup>
          {/* Amount */}
          <Field>
            <FieldLabel>Amount</FieldLabel>
            <FieldDescription>
              1 – {appInfo.limitsPerUser.amount}
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

          {/* Type */}
          <Field>
            <FieldLabel>Transaction Type</FieldLabel>
            <Select value={txnType} onValueChange={(v) => setTxnType(v as TxnType)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {txnTypeValues.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          {/* Category */}
          <Field>
            <FieldLabel>Category</FieldLabel>
            <Select value={category ?? ""} onValueChange={(v) => setCategory(v)}>
              <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          {/* Currency */}
          <Field className="w-24">
            <FieldLabel>Currency</FieldLabel>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {POPULAR_CURRENCIES.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    <HoverCard openDelay={10} closeDelay={50}>
                      <HoverCardTrigger asChild

                      >
                        <span className="flex gap-2">
                          <span>{c.symbol}</span>
                          <span className="text-xs text-muted-foreground">{c.code}</span>
                        </span>
                      </HoverCardTrigger>
                      <HoverCardContent>{c.name}</HoverCardContent>
                    </HoverCard>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          {/* Description */}
          <Field>
            <FieldLabel>Description</FieldLabel>
            <Textarea
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Field>

          {/* Payment Method */}
          <Field>
            <FieldLabel>Payment Method</FieldLabel>
            <Select value={method} onValueChange={(v) => setMethod(v as PaymentType)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {paymentMethodValues.map((m) => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </FieldGroup>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <SubmitButton />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}