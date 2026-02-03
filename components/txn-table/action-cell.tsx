"use client"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { useState } from "react";
import { useCategoryStore } from "@/app/store/categories-store";
import { Button } from "../ui/button";
import { MoreHorizontal, Pen, Trash } from "lucide-react";
import UpdateTxnForm from "./update-txn";
import DeleteTxn from "./delete-txn";
import { Check, Copy } from "lucide-react";
import { Txn } from "./columns";
import { toast } from "sonner";

function copyData(txn: Txn) {
    const categories = useCategoryStore.getState().categories;

    const category =
        txn.categoryId && categories[txn.categoryId]
            ? categories[txn.categoryId].name
            : null;

    const copyPayload = {
        ...txn,
        category: category,
    };

    delete (copyPayload as any).categoryId;
    return navigator.clipboard.writeText(JSON.stringify(copyPayload, null, 2));
}

export default function ActionsCell({ txn }: { txn: Txn }) {

    const [openEdit, setOpenEdit] = useState(false)
    const [openDelete, setOpenDelete] = useState(false)
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        try {
            await copyData(txn);
            setCopied(true);
            toast.success("Transaction copied to clipboard");
            setTimeout(() => setCopied(false), 1500);
        } catch {
            toast.error("Clipboard permission denied");
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon"
                        className="opacity-60 hover:opacity-100">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>

                    <DropdownMenuItem onClick={handleCopy} disabled={copied}>
                        {copied ? <Check /> : <Copy />}
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem onClick={() => setOpenEdit(true)}>
                        <Pen />
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setOpenDelete(true)}>
                        <Trash />
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <UpdateTxnForm
                open={openEdit}
                setOpen={setOpenEdit}
                id={txn.id}
                data={txn}
            />

            <DeleteTxn
                id={txn.id}
                open={openDelete}
                setOpen={setOpenDelete}
            />
        </>
    )
}
