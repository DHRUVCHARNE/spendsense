"use client"
import {columns} from "./columns";
import { DataTable } from "../txn-table/data-table";
import { useCategoryStore } from "@/app/store/categories-store";


export default function CatsPage() {
  const categories = useCategoryStore((s) => s.categoriesArr)

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={categories} />
    </div>
  )
}