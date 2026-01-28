"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useState } from "react";
import { api } from "./client";
import superjson from "superjson";
import { httpBatchLink } from "@trpc/client";

function getUrl() {
    if(typeof window !=="undefined") return "";
    if(process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
    return process.env.LOCAL_URL
}

export function TRPCProvider({children}:{children:React.ReactNode}){
    const [queryClient] = useState(()=>new QueryClient);
    const [trpcClient] = useState(()=>
    api.createClient({
        links:[
            httpBatchLink({
                transformer:superjson,
                url:`${getUrl()}/api/trpc`
            }),
        ],
    })
    );
    return (
        <api.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </api.Provider>
    )
}