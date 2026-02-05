"use client"

import { useState, useEffect } from "react"
import { api } from "@/lib/trpc/client"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group"
import { Search, X } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"

type Props = {
    onResults: (results: any[] | null, query: string) => void;
    clearSignal: number;
}

export function TxnSearchBar({ onResults, clearSignal }: Props) {
    const [query, setQuery] = useState("")
    const [debouncedQuery, setDebouncedQuery] = useState("")

    // ⏳ Debounce logic (400ms)
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(query.trim())
        }, 500)

        return () => clearTimeout(handler)
    }, [query])
    useEffect(() => {
        setQuery("")
        setDebouncedQuery("")
    }, [clearSignal])

    const isSearching = debouncedQuery.length > 0

    const { data, isFetching } = api.txn.search.useQuery(
        { q: debouncedQuery },
        {
            enabled: isSearching,
            staleTime: 15_000,
            refetchOnWindowFocus: false
        }
    )

    // Send results upward
    useEffect(() => {
        if (!isSearching) {
            onResults(null, "")
            return
        } else if (data) {
            onResults(data, debouncedQuery)
        }
    }, [data, isSearching, debouncedQuery, onResults])

    return (
        <InputGroup className="w-full max-w-sm">
            <InputGroupAddon>
                <Search className="h-4 w-4 text-muted-foreground" />
            </InputGroupAddon>

            <InputGroupInput
                placeholder="Search descriptions..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />

            <InputGroupAddon align="inline-end">
                {isFetching && <Spinner />}
                {query && !isFetching && (
                    <button onClick={() => setQuery("")}>
                        <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                    </button>
                )}
            </InputGroupAddon>
        </InputGroup>
    )
}
