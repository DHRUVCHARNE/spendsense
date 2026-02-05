"use client"

import { Field, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select"
import { BaseInput } from "@/lib/txn-service/hooks/useTxns"

type Props = {
  value?: BaseInput["limit"]
  setFilters: React.Dispatch<React.SetStateAction<BaseInput>>,
  disabled:boolean
}

const LIMIT_OPTIONS = [5, 10, 15, 20]

export function TxnLimitFilter({ value, setFilters,disabled }: Props) {
  return (
    <Field className="w-28">
      <FieldLabel htmlFor="limit">Rows</FieldLabel>
      <Select
      disabled={disabled}
        value={value?.toString() ?? "10"}
        onValueChange={(v) =>{
          const num = Number(v);
          setFilters(f => {
            if (f.limit === num) return f 
    return { ...f, limit: num }
          })
        }}
      >
        <SelectTrigger id="limit" className="h-9 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {LIMIT_OPTIONS.map((n) => (
              <SelectItem key={n} value={n.toString()}>
                {n} / page
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  )
}
