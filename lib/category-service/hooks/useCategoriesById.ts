import { useCategoryStore } from "@/app/store/categories-store"
import { api } from "@/lib/trpc/client"
import { useEffect } from "react";
import z from "zod"
export const categoryIdsSchema = z.array(z.uuid())

export function useCategoryByIds(ids:z.infer<typeof categoryIdsSchema>){
    const hydrate = useCategoryStore((s)=>s.hydrate);
    const query=  api.category.getByIds.useQuery(
        {ids},{
            enabled:ids.length >0
        }
    );
    //When categories arrive fill zustand map
    useEffect(()=>{
        if(query.data){
            hydrate(query.data)
        }
    },[query.data,hydrate]);
    return query;
}