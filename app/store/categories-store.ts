import { immer } from "zustand/middleware/immer";
import { create } from "zustand";
import z from "zod";
import { categoriesSelectSchema } from "@/lib/db/zod-schema";

export type CategoryMeta = z.infer<typeof categoriesSelectSchema>;

type CategoryState = {
  categories: Record<string, CategoryMeta>;
  categoriesArr: CategoryMeta[];
  hydrate: (cats: CategoryMeta[]) => void;
  remove: (id: string) => void;
  clear: () => void;
  upsert:(cat:CategoryMeta)=>void;
};

export const useCategoryStore = create<CategoryState>()(
  immer((set) => ({
    categories: {},
    categoriesArr: [],
    hydrate: (cats) =>
      set((state) => {
        for (const c of cats) {
          state.categories[c.id] = c;
        }
        state.categoriesArr = Object.values(state.categories);
      }),
    remove: (id) => {
      set((state) => {
        delete state.categories[id];
        state.categoriesArr = Object.values(state.categories);
      });
    },
    clear: () => {
      set((state) => {
        state.categories = {};
        state.categoriesArr = [];
      });
    },

    upsert: (cat: CategoryMeta) =>
      set((state) => {
        state.categories[cat.id] = cat
        state.categoriesArr = Object.values(state.categories)
      }),
  })),
);
