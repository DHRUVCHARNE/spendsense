"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Field, FieldLabel } from "@/components/ui/field"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"
import { BaseInput } from "@/lib/txn-service/hooks/useTxns"

type Props = {
  from?: Date
  to?: Date
  setFilters: React.Dispatch<React.SetStateAction<BaseInput>>
}

export function TxnDateRangeFilter({ from, to, setFilters }: Props) {
  const [range, setRange] = React.useState<DateRange | undefined>({
    from,
    to,
  })

 React.useEffect(() => {
  setFilters(f => {
    if (
      f.from?.getTime() === range?.from?.getTime() &&
      f.to?.getTime() === range?.to?.getTime()
    ) return f 

    return {
      ...f,
      from: range?.from ?? undefined,
      to: range?.to ?? undefined,
    }
  })
}, [range, setFilters])

  return (
    <Field className="w-60">
      <FieldLabel>Date Range</FieldLabel>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="justify-start text-left font-normal">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {range?.from ? (
              range.to ? (
                <>
                  {format(range.from, "dd MMM yyyy")} - {format(range.to, "dd MMM yyyy")}
                </>
              ) : (
                format(range.from, "dd MMM yyyy")
              )
            ) : (
              <span>Pick date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={range}
            onSelect={setRange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </Field>
  )
}
