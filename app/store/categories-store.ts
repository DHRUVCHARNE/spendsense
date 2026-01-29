import { hydrate } from "@tanstack/react-query";
import z from "zod";
import {create} from "zustand";

export type CategoryMeta = {
    id:string,
    name?:string,
    color?:string | null
}

type CategoryState = {
    categories:Record<string,CategoryMeta>
    hydrate: (cats:CategoryMeta[]) => void
}

export const useCategoryStore = create<CategoryState>((set)=>({
    categories:{},
    hydrate:(cats)=>
        set((state)=>({
            categories:{
                ...state.categories,
                ...Object.fromEntries(cats.map((c)=> [c.id,c])),
            }
        }))

}))