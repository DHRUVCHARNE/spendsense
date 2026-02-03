"use client"

import { useState, useTransition } from "react"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Field, FieldGroup, FieldLabel, FieldDescription } from "../ui/field"
import { Input } from "../ui/input"
import { createCategoryAction } from "@/app/actions/actions"
import { toast } from "sonner"
import { Spinner } from "../ui/spinner"
import { Tag } from "lucide-react"
import {  useCategoryStore } from "@/app/store/categories-store"
import { api } from "@/lib/trpc/client"

export default function CreateCategoryForm({
    open,
    setOpen,
}: {
    open: boolean
    setOpen: (v: boolean) => void
}) {
    const [name, setName] = useState("")
    const [color, setColor] = useState("#6366f1") // default indigo
    const [isPending, startTransition] = useTransition()
    const upsert = useCategoryStore((s) => s.upsert);
    const utils = api.useUtils();
    function handleSubmit() {
        startTransition(async () => {
            const formData = new FormData()
            formData.append("name", name.trim())
            if (color) formData.append("color", color)

            const res = await createCategoryAction(formData)

            if (res?.ok && res.data) {
                upsert(res.data) //
                utils.category.list.invalidate();
                toast.success("Category created")
                setOpen(false)
            } else {
                toast.error(res?.message ?? "Failed to create category")
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button type="button" variant="outline">
                    <Tag className="mr-2 h-4 w-4" />
                    Add Category
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Create Category</DialogTitle>
                    <DialogDescription>
                        Organize your transactions with custom categories.
                    </DialogDescription>
                </DialogHeader>

                <FieldGroup>
                    <Field>
                        <FieldLabel>Category Name</FieldLabel>
                        <FieldDescription>
                            Short and clear name (e.g. Food, Travel, Salary)
                        </FieldDescription>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Food"
                        />
                    </Field>

                    <Field>
                        <FieldLabel>Color</FieldLabel>
                        <FieldDescription>
                            Used for visual tagging in charts & lists
                        </FieldDescription>

                        <div className="flex items-center gap-3">
                            <Input
                                type="color"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                className="h-10 w-16 p-1"
                            />
                            <span
                                className="h-6 w-6 rounded-full border"
                                style={{ backgroundColor: color }}
                            />
                        </div>
                    </Field>
                </FieldGroup>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isPending}>
                        {isPending ? <Spinner /> : "Create"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
