"use client"
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useTransition, useState } from "react";
import { Spinner } from "../ui/spinner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogTrigger,
} from "../ui/dialog";
import { deleteUserAction } from "@/app/actions/actions";
import { redirect, useRouter } from "next/navigation";
type Props = {
    id: string 
} & React.ComponentPropsWithRef<typeof Button>
export function DeleteAccount({ id, ...props }: Props) {
    const [pending, startTransition] = useTransition();
    const [open, setOpen] = useState<boolean>(false);
    const router = useRouter();
    const handleDelete = () => {
        startTransition(async () => {
            const formData = new FormData();
            formData.append("id", id);

            const res = await deleteUserAction(formData);

            if (res?.ok) {
                toast.success("Account deleted 🗑️");
                setOpen(false);
                router.push("/");
                
            } else {
                toast.error(res?.message ?? "Failed to delete your Account");
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="destructive" className="w-full p-0"
                onClick={(e)=>e.stopPropagation()} >
                    Delete Account
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle className="text-red-600">Delete Account?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete your account.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setOpen(false)}
                        disabled={pending}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={pending}
                    >
                        {pending ? <Spinner className="h-4 w-4" /> : "Delete"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}